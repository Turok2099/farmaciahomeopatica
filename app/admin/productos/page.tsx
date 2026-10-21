import Link from "next/link"
import { asc, eq, ilike } from "drizzle-orm"
import { db } from "@/lib/db"
import { categories, products } from "@/lib/schema"
import { requireRole } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { toggleAvailability } from "@/app/admin/actions"

const money = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" })

export default async function AdminProducts(props: { searchParams: Promise<{ q?: string }> }) {
    const user = await requireRole("admin", "staff")
    const isAdmin = user.role === "admin"
    const { q } = await props.searchParams
    const query = q?.trim() ?? ""

    const rows = await db
        .select({
            id: products.id,
            name: products.name,
            category: categories.name,
            priceCents: products.priceCents,
            available: products.available,
            published: products.published,
            hasImage: products.imageId,
        })
        .from(products)
        .innerJoin(categories, eq(products.categoryId, categories.id))
        .where(query ? ilike(products.name, `%${query}%`) : undefined)
        .orderBy(asc(products.name))

    return (
        <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-semibold">Productos <span className="text-base font-normal text-[var(--muted-foreground)]">({rows.length})</span></h1>
                <div className="flex gap-3">
                    <form role="search" className="flex gap-2">
                        <label htmlFor="admin-q" className="sr-only">Buscar producto</label>
                        <input
                            id="admin-q"
                            name="q"
                            defaultValue={query}
                            placeholder="Buscar..."
                            className="h-10 rounded-md border border-[var(--border)] bg-transparent px-3 text-sm"
                        />
                        <Button variant="outline">Buscar</Button>
                    </form>
                    {isAdmin && (
                        <Link href="/admin/productos/nuevo"><Button>Nuevo producto</Button></Link>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[var(--muted)] text-[var(--muted-foreground)]">
                        <tr>
                            <th className="px-4 py-3 font-medium">Producto</th>
                            <th className="px-4 py-3 font-medium">Categoría</th>
                            <th className="px-4 py-3 font-medium">Precio</th>
                            <th className="px-4 py-3 font-medium">Disponible</th>
                            {isAdmin && <th className="px-4 py-3 font-medium"><span className="sr-only">Editar</span></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.id} className="border-t border-[var(--border)]">
                                <td className="px-4 py-3">
                                    <span className="font-medium">{row.name}</span>
                                    {!row.published && <span className="ml-2 rounded bg-[var(--muted)] px-2 py-0.5 text-xs">Oculto</span>}
                                    {!row.hasImage && <span className="ml-2 text-xs text-[var(--muted-foreground)]">sin foto</span>}
                                </td>
                                <td className="px-4 py-3 text-[var(--muted-foreground)]">{row.category}</td>
                                <td className="px-4 py-3">{money.format(row.priceCents / 100)}</td>
                                <td className="px-4 py-3">
                                    <form action={toggleAvailability}>
                                        <input type="hidden" name="id" value={row.id} />
                                        <button
                                            type="submit"
                                            role="switch"
                                            aria-checked={row.available}
                                            aria-label={`${row.name}: ${row.available ? "disponible" : "agotado"}`}
                                            className={`relative h-6 w-11 rounded-full transition-colors ${row.available ? "bg-[var(--primary)]" : "bg-[var(--silver)]"}`}
                                        >
                                            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${row.available ? "left-[22px]" : "left-0.5"}`} />
                                        </button>
                                    </form>
                                </td>
                                {isAdmin && (
                                    <td className="px-4 py-3 text-right">
                                        <Link href={`/admin/productos/${row.id}`} className="text-[var(--primary)] hover:underline">Editar</Link>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {rows.length === 0 && (
                            <tr><td colSpan={5} className="px-4 py-10 text-center text-[var(--muted-foreground)]">Sin resultados.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
