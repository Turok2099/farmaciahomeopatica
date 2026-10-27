import type { orders, orderItems } from "@/lib/schema";
import { sendEmail } from "@/lib/email";
import { CONTACT_EMAIL, emailButton, emailLayout, emailStyles as s, esc } from "@/lib/email-layout";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { HOURS_LINES } from "@/lib/store-hours";

type Order = typeof orders.$inferSelect;
type OrderItem = typeof orderItems.$inferSelect;

const money = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });
const cents = (value: number) => money.format(value / 100);

export function renderOrderConfirmation(order: Order, items: OrderItem[]) {
    const pickup = order.fulfillment === "pickup";
    const orderUrl = `${SITE_URL}/checkout/exito?pedido=${order.publicId}`;
    const hours = HOURS_LINES.map((l) => `${l.days}: ${l.hours}`).join(" · ");
    const shipping = order.shippingCents ? cents(order.shippingCents) : "Gratis";

    const deliveryTitle = pickup ? "Recoger en sucursal" : "Entrega a domicilio";
    const deliveryText = pickup
        ? `Alfonso Reyes 234, Col. Condesa, Ciudad de México. ${hours}. Te avisaremos cuando tu pedido esté listo.`
        : `${order.addressStreet}, ${order.addressNeighborhood}, CP ${order.addressPostalCode}, Ciudad de México.`;

    const rows = items
        .map(
            (i) => `<tr>
<td style="padding:10px 0;border-bottom:1px solid ${s.colors.border};font-size:15px;color:${s.colors.text}">${i.quantity} × ${esc(i.name)}</td>
<td align="right" style="padding:10px 0;border-bottom:1px solid ${s.colors.border};font-size:15px;color:${s.colors.text};white-space:nowrap">${cents(i.unitPriceCents * i.quantity)}</td>
</tr>`,
        )
        .join("");

    const body = `
<h1 style="${s.h1}">¡Gracias por tu compra, ${esc(order.customerName)}!</h1>
<p style="${s.p}">Recibimos el pago de tu pedido <strong>${order.orderNumber}</strong>. Aquí tienes el resumen.</p>

<div style="${s.box}">
  <p style="margin:0 0 4px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:${s.colors.brand}">${deliveryTitle}</p>
  <p style="margin:0;font-size:15px;line-height:1.5;color:${s.colors.text}">${esc(deliveryText)}</p>
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 8px">
${rows}
<tr>
<td style="padding:10px 0;font-size:15px;color:${s.colors.muted}">Envío</td>
<td align="right" style="padding:10px 0;font-size:15px;color:${s.colors.muted}">${shipping}</td>
</tr>
<tr>
<td style="padding:12px 0 0;border-top:2px solid ${s.colors.brand};font-size:18px;font-weight:700;color:${s.colors.text}">Total</td>
<td align="right" style="padding:12px 0 0;border-top:2px solid ${s.colors.brand};font-size:18px;font-weight:700;color:${s.colors.text}">${cents(order.totalCents)}</td>
</tr>
</table>

${emailButton(orderUrl, "Ver mi pedido")}
<p style="${s.small}">Este mensaje es una confirmación de compra, no una factura.</p>`;

    const text = [
        `¡Gracias por tu compra, ${order.customerName}!`,
        `Recibimos el pago de tu pedido ${order.orderNumber}.`,
        "",
        `${deliveryTitle}: ${deliveryText}`,
        "",
        ...items.map((i) => `${i.quantity} x ${i.name}: ${cents(i.unitPriceCents * i.quantity)}`),
        `Envío: ${shipping}`,
        `Total: ${cents(order.totalCents)}`,
        "",
        `Ver mi pedido: ${orderUrl}`,
        `¿Dudas? Escríbenos a ${CONTACT_EMAIL}`,
        "",
        "Este mensaje es una confirmación de compra, no una factura.",
        SITE_NAME,
    ].join("\n");

    return {
        subject: `Confirmación de tu pedido ${order.orderNumber} | ${SITE_NAME}`,
        html: emailLayout({ preheader: `Recibimos tu pago. Pedido ${order.orderNumber} por ${cents(order.totalCents)}.`, body }),
        text,
    };
}

export async function sendOrderConfirmation(order: Order, items: OrderItem[]) {
    await sendEmail({ to: order.customerEmail, replyTo: CONTACT_EMAIL, ...renderOrderConfirmation(order, items) });
}
