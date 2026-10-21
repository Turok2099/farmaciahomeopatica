import type { Metadata } from "next"
import Link from "next/link"
import { count, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { orders } from "@/lib/schema"
import { requireRole } from "@/lib/auth"

export const metadata: Metadata = {
    title: "Panel | Homeopáticos Schüssler",
    robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const user = await requireRole("admin", "staff")
    const isAdmin = user.role === "admin"
    const [{ toDeliver }] = isAdmin
        ? await db.select({ toDeliver: count() }).from(orders).where(eq(orders.status, "paid"))
        : [{ toDeliver: 0 }]

    return (
        <div className="container-custom py-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
                <nav aria-label="Panel" className="flex flex-wrap gap-4 text-sm font-medium">
                    <Link href="/admin/productos" className="hover:text-[var(--primary)]">Productos</Link>
                    {isAdmin && (
                        <Link href="/admin/pedidos" className="hover:text-[var(--primary)]">
                            Pedidos
                            {toDeliver > 0 && (
                                <span className="ml-1.5 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900" aria-label={`${toDeliver} por entregar`}>{toDeliver}</span>
                            )}
                        </Link>
                    )}
                    {isAdmin && <Link href="/admin/categorias" className="hover:text-[var(--primary)]">Categorías</Link>}
                    {isAdmin && <Link href="/admin/usuarios" className="hover:text-[var(--primary)]">Usuarios</Link>}
                </nav>
                <p className="text-sm text-[var(--muted-foreground)]">
                    {user.name} · {isAdmin ? "Administrador" : "Colaborador"}
                </p>
            </div>
            {children}
        </div>
    )
}
