import Link from "next/link"
import { desc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { orders, orderStatuses, type OrderStatus } from "@/lib/schema"
import { requireRole } from "@/lib/auth"
import { statusLabels } from "@/lib/orders"

const money = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" })
const dateFmt = new Intl.DateTimeFormat("es-MX", { dateStyle: "short", timeStyle: "short", timeZone: "America/Mexico_City" })

export const statusStyles: Record<OrderStatus, string> = {
    pending: "bg-[var(--muted)] text-[var(--muted-foreground)]",
    paid: "bg-amber-100 text-amber-900",
    delivered: "bg-emerald-100 text-emerald-900",
    cancelled: "bg-red-100 text-red-900",
}

export default async function AdminOrders(props: { searchParams: Promise<{ estado?: string }> }) {
    await requireRole("admin")
    const { estado } = await props.searchParams
    const filter = orderStatuses.find((s) => s === estado)

    const rows = await db
        .select()
        .from(orders)
        .where(filter ? eq(orders.status, filter) : undefined)
        .orderBy(desc(orders.createdAt))
        .limit(200)

    const tab = (active: boolean) =>
        `rounded-full border px-3 py-1 text-sm ${active ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]" : "border-[var(--border)] hover:border-[var(--primary)]"}`

    return (
        <div>
            <h1 className="mb-4 text-2xl font-semibold">Pedidos</h1>
            <nav aria-label="Filtrar por estado" className="mb-6 flex flex-wrap gap-2">
                <Link href="/admin/pedidos" className={tab(!filter)}>Todos</Link>
                {orderStatuses.map((s) => (
                    <Link key={s} href={`/admin/pedidos?estado=${s}`} className={tab(filter === s)}>{statusLabels[s]}</Link>
                ))}
            </nav>

            <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[var(--muted)] text-[var(--muted-foreground)]">
                        <tr>
                            <th className="px-4 py-3 font-medium">Pedido</th>
                            <th className="px-4 py-3 font-medium">Fecha</th>
                            <th className="px-4 py-3 font-medium">Cliente</th>
                            <th className="px-4 py-3 font-medium">Entrega</th>
                            <th className="px-4 py-3 font-medium">Total</th>
                            <th className="px-4 py-3 font-medium">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((o) => (
                            <tr key={o.id} className="border-t border-[var(--border)]">
                                <td className="px-4 py-3"><Link href={`/admin/pedidos/${o.id}`} className="font-medium text-[var(--primary)] hover:underline">#{o.id}</Link></td>
                                <td className="px-4 py-3 text-[var(--muted-foreground)]">{dateFmt.format(o.createdAt)}</td>
                                <td className="px-4 py-3">{o.customerName}</td>
                                <td className="px-4 py-3">{o.fulfillment === "pickup" ? "Recoger" : `Domicilio · CP ${o.addressPostalCode}`}</td>
                                <td className="px-4 py-3">{money.format(o.totalCents / 100)}</td>
                                <td className="px-4 py-3"><span className={`rounded px-2 py-0.5 text-xs font-medium ${statusStyles[o.status]}`}>{statusLabels[o.status]}</span></td>
                            </tr>
                        ))}
                        {rows.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-[var(--muted-foreground)]">Sin pedidos.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
