import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/outline"
import { getStripe } from "@/lib/stripe"
import { getOrderByPublicId, markOrderPaid, sendConfirmationOnce } from "@/lib/orders"
import { ClearCart, Refresh } from "@/components/cart/success-helpers"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
    title: "Pedido recibido",
    robots: { index: false, follow: false },
}

const money = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" })

export default async function SuccessPage(props: { searchParams: Promise<{ pedido?: string }> }) {
    const { pedido } = await props.searchParams
    if (!pedido || !/^[a-f0-9]{32}$/.test(pedido)) notFound()

    let data = await getOrderByPublicId(pedido)
    if (!data) notFound()

    // Si el webhook aún no llega (o no está activo en local), se confirma directo con Stripe.
    if (data.order.status === "pending" && data.order.stripeSessionId) {
        try {
            const session = await getStripe().checkout.sessions.retrieve(data.order.stripeSessionId)
            if (session.payment_status === "paid") {
                const intent = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null
                await markOrderPaid(session.id, session.amount_total, intent)
                data = (await getOrderByPublicId(pedido)) ?? data
            }
        } catch (error) {
            console.error("No se pudo consultar la sesión de Stripe", error instanceof Error ? error.message : error)
        }
    }

    // Si el correo de confirmación no salió antes (p. ej. falló Resend), se reintenta al abrir esta página.
    if (data.order.status === "paid" && !data.order.confirmationSentAt) await sendConfirmationOnce(data.order.id)

    const { order, items } = data
    const paid = order.status === "paid" || order.status === "delivered"
    const pickup = order.fulfillment === "pickup"

    return (
        <div className="container-custom max-w-2xl py-12">
            {paid && <ClearCart />}
            {order.status === "pending" && <Refresh />}

            <div className="mb-8 text-center">
                {paid ? <CheckCircleIcon className="mx-auto mb-3 h-12 w-12 text-[var(--accent)]" /> : <ClockIcon className="mx-auto mb-3 h-12 w-12 text-[var(--muted-foreground)]" />}
                <h1 className="text-3xl font-bold">
                    {paid ? "¡Gracias por tu compra!" : order.status === "cancelled" ? "Pedido cancelado" : "Confirmando tu pago…"}
                </h1>
                <p className="mt-2 text-[var(--muted-foreground)]" role="status">
                    {paid
                        ? `Tu pedido ${order.orderNumber} está pagado. Te enviaremos la confirmación de tu pedido a ${order.customerEmail}.`
                        : order.status === "cancelled"
                            ? "Este pedido no se completó. Puedes volver a intentarlo desde tu carrito."
                            : "Estamos esperando la confirmación del banco. Esta página se actualiza sola."}
                </p>
            </div>

            <div className="rounded-lg border border-[var(--border)] p-5">
                <h2 className="mb-3 font-semibold">{pickup ? "Recoger en sucursal" : "Entrega a domicilio"}</h2>
                {pickup ? (
                    <p className="text-sm text-[var(--muted-foreground)]">
                        Alfonso Reyes 234, Ciudad de México. Horario: lunes a viernes de 10:00 a 18:00 h y sábados de 10:00 a 17:00 h. Te avisaremos cuando esté listo.
                    </p>
                ) : (
                    <p className="text-sm text-[var(--muted-foreground)]">
                        {order.addressStreet}, {order.addressNeighborhood}, CP {order.addressPostalCode}, Ciudad de México.
                    </p>
                )}
                <ul className="mt-5 divide-y divide-[var(--border)] border-t border-[var(--border)] text-sm">
                    {items.map((i) => (
                        <li key={i.id} className="flex justify-between gap-3 py-2">
                            <span>{i.quantity} × {i.name}</span>
                            <span>{money.format((i.unitPriceCents * i.quantity) / 100)}</span>
                        </li>
                    ))}
                </ul>
                <p className="mt-3 flex justify-between border-t border-[var(--border)] pt-3 font-semibold">
                    <span>Total</span><span>{money.format(order.totalCents / 100)}</span>
                </p>
            </div>

            <div className="mt-8 text-center">
                <Link href="/productos"><Button variant="outline">Seguir comprando</Button></Link>
            </div>
        </div>
    )
}
