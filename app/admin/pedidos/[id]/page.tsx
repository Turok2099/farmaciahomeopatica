import Link from "next/link"
import { notFound } from "next/navigation"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { orders, orderItems } from "@/lib/schema"
import { requireRole } from "@/lib/auth"
import { statusLabels } from "@/lib/orders"
import { Button } from "@/components/ui/button"
import { updateOrderStatus } from "@/app/admin/actions"
import { statusStyles } from "@/app/admin/pedidos/page"

const money = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" })
const dateFmt = new Intl.DateTimeFormat("es-MX", { dateStyle: "long", timeStyle: "short", timeZone: "America/Mexico_City" })

export default async function AdminOrderDetail(props: { params: Promise<{ id: string }> }) {
    await requireRole("admin")
    const { id } = await props.params
    const orderId = Number(id)
    if (!Number.isInteger(orderId)) notFound()

    const [order] = await db.select().from(orders).where(eq(orders.id, orderId))
    if (!order) notFound()
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id))
    const phone = `52${order.customerPhone}`

    return (
        <div className="max-w-3xl">
            <Link href="/admin/pedidos" className="text-sm text-[var(--primary)] hover:underline">← Pedidos</Link>
            <div className="mb-6 mt-2 flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold">Pedido #{order.id}</h1>
                <span className={`rounded px-2 py-0.5 text-xs font-medium ${statusStyles[order.status]}`}>{statusLabels[order.status]}</span>
            </div>
            <p className="mb-6 text-sm text-[var(--muted-foreground)]">
                Creado: {dateFmt.format(order.createdAt)}{order.paidAt && ` · Pagado: ${dateFmt.format(order.paidAt)}`}
            </p>

            <div className="mb-6 grid gap-4 sm:grid-cols-2">
                <section className="rounded-lg border border-[var(--border)] p-4 text-sm">
                    <h2 className="mb-2 font-semibold">Cliente</h2>
                    <p>{order.customerName}</p>
                    <p><a href={`mailto:${order.customerEmail}`} className="text-[var(--primary)] hover:underline">{order.customerEmail}</a></p>
                    <p>
                        {order.customerPhone} ·{" "}
                        <a href={`https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">WhatsApp</a>
                    </p>
                </section>
                <section className="rounded-lg border border-[var(--border)] p-4 text-sm">
                    <h2 className="mb-2 font-semibold">{order.fulfillment === "pickup" ? "Recoger en sucursal" : "Entrega a domicilio"}</h2>
                    {order.fulfillment === "pickup" ? <p>Alfonso Reyes 234, CDMX.</p> : (
                        <>
                            <p>{order.addressStreet}</p>
                            <p>{order.addressNeighborhood}, CP {order.addressPostalCode}</p>
                            {order.addressNotes && <p className="mt-1 text-[var(--muted-foreground)]">Ref.: {order.addressNotes}</p>}
                        </>
                    )}
                </section>
            </div>

            <ul className="mb-3 divide-y divide-[var(--border)] rounded-lg border border-[var(--border)] text-sm">
                {items.map((i) => (
                    <li key={i.id} className="flex justify-between gap-3 p-3">
                        <span>{i.quantity} × {i.name} <span className="text-[var(--muted-foreground)]">({money.format(i.unitPriceCents / 100)} c/u)</span></span>
                        <span>{money.format((i.unitPriceCents * i.quantity) / 100)}</span>
                    </li>
                ))}
            </ul>
            <p className="mb-8 flex justify-between font-semibold"><span>Total</span><span>{money.format(order.totalCents / 100)}</span></p>

            <div className="flex flex-wrap gap-3">
                {order.status === "paid" && (
                    <form action={updateOrderStatus}>
                        <input type="hidden" name="id" value={order.id} />
                        <input type="hidden" name="status" value="delivered" />
                        <Button>{order.fulfillment === "pickup" ? "Marcar como recogido" : "Marcar como entregado"}</Button>
                    </form>
                )}
                {(order.status === "pending" || order.status === "paid") && (
                    <form action={updateOrderStatus}>
                        <input type="hidden" name="id" value={order.id} />
                        <input type="hidden" name="status" value="cancelled" />
                        <Button variant="outline" className="text-red-600">Cancelar pedido</Button>
                    </form>
                )}
            </div>
            {order.status === "paid" && (
                <p className="mt-3 text-xs text-[var(--muted-foreground)]">
                    Cancelar aquí no devuelve el dinero: el reembolso se hace desde el panel de Stripe (Pagos).
                </p>
            )}
        </div>
    )
}
