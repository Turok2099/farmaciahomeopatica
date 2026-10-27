import type { orders, orderItems } from "@/lib/schema";
import { sendEmail } from "@/lib/email";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { HOURS_LINES } from "@/lib/store-hours";

type Order = typeof orders.$inferSelect;
type OrderItem = typeof orderItems.$inferSelect;

const CONTACT_EMAIL = "contacto@schussler.com.mx";
const money = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });
const cents = (value: number) => money.format(value / 100);

// Los datos del cliente se insertan en HTML: se escapan siempre.
const esc = (value: string) =>
    value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export async function sendOrderConfirmation(order: Order, items: OrderItem[]) {
    const pickup = order.fulfillment === "pickup";
    const orderUrl = `${SITE_URL}/checkout/exito?pedido=${order.publicId}`;
    const hours = HOURS_LINES.map((l) => `${l.days}: ${l.hours}`).join(" · ");

    const delivery = pickup
        ? `Recoger en sucursal: Alfonso Reyes 234, Col. Condesa, Ciudad de México. ${hours}. Te avisaremos cuando esté listo.`
        : `Entrega a domicilio: ${order.addressStreet}, ${order.addressNeighborhood}, CP ${order.addressPostalCode}, Ciudad de México.`;

    const rows = items
        .map((i) => `<tr><td style="padding:6px 0">${i.quantity} × ${esc(i.name)}</td><td style="padding:6px 0;text-align:right">${cents(i.unitPriceCents * i.quantity)}</td></tr>`)
        .join("");

    const html = `<div style="font-family:system-ui,Arial,sans-serif;max-width:560px;margin:0 auto;color:#172b3a">
<h1 style="font-size:22px">¡Gracias por tu compra, ${esc(order.customerName)}!</h1>
<p>Recibimos el pago de tu pedido <strong>#${order.id}</strong>.</p>
<p>${esc(delivery)}</p>
<table style="width:100%;border-collapse:collapse;border-top:1px solid #dde3e8;border-bottom:1px solid #dde3e8;margin:16px 0">${rows}
<tr><td style="padding:6px 0;color:#5b6b78">Envío</td><td style="padding:6px 0;text-align:right;color:#5b6b78">${order.shippingCents ? cents(order.shippingCents) : "Gratis"}</td></tr>
<tr><td style="padding:6px 0"><strong>Total</strong></td><td style="padding:6px 0;text-align:right"><strong>${cents(order.totalCents)}</strong></td></tr></table>
<p><a href="${orderUrl}" style="color:#014c80">Ver mi pedido</a></p>
<p style="color:#5b6b78;font-size:14px">¿Dudas? Responde a este correo o escríbenos a ${CONTACT_EMAIL}.</p>
<p style="color:#5b6b78;font-size:12px">Este mensaje es una confirmación de compra, no una factura.</p>
</div>`;

    const text = [
        `¡Gracias por tu compra, ${order.customerName}!`,
        `Recibimos el pago de tu pedido #${order.id}.`,
        delivery,
        "",
        ...items.map((i) => `${i.quantity} x ${i.name}: ${cents(i.unitPriceCents * i.quantity)}`),
        `Envío: ${order.shippingCents ? cents(order.shippingCents) : "Gratis"}`,
        `Total: ${cents(order.totalCents)}`,
        "",
        `Ver mi pedido: ${orderUrl}`,
        `¿Dudas? ${CONTACT_EMAIL}`,
    ].join("\n");

    await sendEmail({
        to: order.customerEmail,
        subject: `Confirmación de tu pedido #${order.id} | ${SITE_NAME}`,
        html,
        text,
        replyTo: CONTACT_EMAIL,
    });
}
