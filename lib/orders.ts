import { and, eq, inArray, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, orderItems, type OrderStatus } from "@/lib/schema";
import { sendOrderConfirmation } from "@/lib/order-email";

// Envío gratis a domicilio solo si el subtotal es MAYOR a $800.
export const FREE_SHIPPING_OVER_CENTS = 80000;

// Códigos postales de la Ciudad de México: 01000 a 16999.
export function isCdmxPostalCode(value: string) {
    if (!/^\d{5}$/.test(value)) return false;
    const n = Number(value);
    return n >= 1000 && n <= 16999;
}

export const statusLabels: Record<OrderStatus, string> = {
    pending: "Pendiente de pago",
    paid: "Pagado · por entregar",
    delivered: "Entregado",
    cancelled: "Cancelado",
};

// Idempotente: el webhook y la página de éxito pueden llamarla las dos veces.
export async function markOrderPaid(sessionId: string, amountTotal: number | null, paymentIntentId: string | null) {
    const [order] = await db.select().from(orders).where(eq(orders.stripeSessionId, sessionId));
    if (!order) return { ok: false as const, reason: "pedido no encontrado" };
    if (order.status !== "pending") return { ok: true as const, order }; // ya procesado

    if (amountTotal !== order.totalCents) {
        // Nunca marcamos como pagado un monto distinto al esperado.
        console.error(`Pedido ${order.id}: monto cobrado ${amountTotal} distinto al esperado ${order.totalCents}`);
        return { ok: false as const, reason: "monto distinto" };
    }

    const updated = await db
        .update(orders)
        .set({ status: "paid", paidAt: new Date(), stripePaymentIntentId: paymentIntentId })
        .where(and(eq(orders.id, order.id), eq(orders.status, "pending")))
        .returning({ id: orders.id });

    if (updated.length > 0) await sendConfirmationOnce(order.id);
    return { ok: true as const, order };
}

// Envía la confirmación una sola vez. Se "reclama" el envío con un UPDATE atómico antes de mandar el
// correo: si el webhook y la página de éxito coinciden, solo uno lo envía. Si Resend falla se libera
// el reclamo, y el siguiente intento (por ejemplo, al recargar la página de éxito) lo reintenta.
export async function sendConfirmationOnce(orderId: number) {
    const [claimed] = await db
        .update(orders)
        .set({ confirmationSentAt: new Date() })
        .where(and(eq(orders.id, orderId), isNull(orders.confirmationSentAt), inArray(orders.status, ["paid", "delivered"])))
        .returning();
    if (!claimed) return false;

    try {
        const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
        await sendOrderConfirmation(claimed, items);
        return true;
    } catch (error) {
        // Un fallo del correo nunca debe revertir el pago ni hacer que Stripe reintente el webhook.
        console.error(`Pedido ${orderId}: no se pudo enviar la confirmación`, error instanceof Error ? error.message : error);
        await db.update(orders).set({ confirmationSentAt: null }).where(eq(orders.id, orderId));
        return false;
    }
}

// Reenvío manual desde el panel: ignora si ya se había enviado.
export async function resendConfirmation(orderId: number) {
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
    if (!order || (order.status !== "paid" && order.status !== "delivered")) return false;
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
    await sendOrderConfirmation(order, items);
    await db.update(orders).set({ confirmationSentAt: new Date() }).where(eq(orders.id, orderId));
    return true;
}

export async function cancelPendingOrder(sessionId: string) {
    await db
        .update(orders)
        .set({ status: "cancelled" })
        .where(and(eq(orders.stripeSessionId, sessionId), eq(orders.status, "pending")));
}

export async function getOrderByPublicId(publicId: string) {
    const [order] = await db.select().from(orders).where(eq(orders.publicId, publicId));
    if (!order) return null;
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    return { order, items };
}
