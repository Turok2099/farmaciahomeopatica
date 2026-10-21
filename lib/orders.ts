import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, orderItems, type OrderStatus } from "@/lib/schema";

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

    await db
        .update(orders)
        .set({ status: "paid", paidAt: new Date(), stripePaymentIntentId: paymentIntentId })
        .where(and(eq(orders.id, order.id), eq(orders.status, "pending")));
    return { ok: true as const, order };
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
