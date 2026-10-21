import { asc, count, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { categories, products } from "@/lib/schema"
import { requireRole } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { NewCategoryForm } from "@/components/admin/simple-forms"
import { deleteCategory, renameCategory } from "@/app/admin/actions"

export default async function AdminCategories() {
    await requireRole("admin")
    const rows = await db
        .select({ id: categories.id, name: categories.name, total: count(products.id) })
        .from(categories)
        .leftJoin(products, eq(products.categoryId, categories.id))
        .groupBy(categories.id)
        .orderBy(asc(categories.name))

    return (
        <div className="max-w-2xl">
            <h1 className="mb-6 text-2xl font-semibold">Categorías</h1>
            <div className="mb-6"><NewCategoryForm /></div>
            <ul className="divide-y divide-[var(--border)] rounded-lg border border-[var(--border)]">
                {rows.map((row) => (
                    <li key={row.id} className="flex flex-wrap items-center gap-3 p-3">
                        <form action={renameCategory} className="flex flex-1 items-center gap-2">
                            <input type="hidden" name="id" value={row.id} />
                            <label htmlFor={`cat-${row.id}`} className="sr-only">Nombre de la categoría</label>
                            <input id={`cat-${row.id}`} name="name" defaultValue={row.name} className="h-9 flex-1 rounded-md border border-[var(--border)] bg-transparent px-3 text-sm" />
                            <Button size="sm" variant="outline">Renombrar</Button>
                        </form>
                        <span className="text-sm text-[var(--muted-foreground)]">{row.total} productos</span>
                        {row.total === 0 && (
                            <form action={deleteCategory}>
                                <input type="hidden" name="id" value={row.id} />
                                <Button size="sm" variant="ghost" className="text-red-600">Eliminar</Button>
                            </form>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}
