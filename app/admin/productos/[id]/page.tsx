import { notFound } from "next/navigation"
import { asc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { categories, products } from "@/lib/schema"
import { requireRole } from "@/lib/auth"
import { ProductForm } from "@/components/admin/product-form"
import { Button } from "@/components/ui/button"
import { deleteProduct } from "@/app/admin/actions"

export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
    await requireRole("admin")
    const { id } = await props.params
    const productId = Number(id)
    if (!Number.isInteger(productId)) notFound()

    const [product] = await db.select().from(products).where(eq(products.id, productId))
    if (!product) notFound()
    const cats = await db.select({ id: categories.id, name: categories.name }).from(categories).orderBy(asc(categories.name))

    return (
        <div>
            <h1 className="mb-6 text-2xl font-semibold">Editar producto</h1>
            <ProductForm
                cloudName={process.env.CLOUDINARY_CLOUD_NAME ?? ""}
                categories={cats}
                values={{
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: (product.priceCents / 100).toFixed(2),
                    categoryId: product.categoryId,
                    presentation: product.presentation,
                    description: product.description,
                    imageId: product.imageId,
                    available: product.available,
                    published: product.published,
                    featured: product.featured,
                }}
            />
            <form action={deleteProduct} className="mt-10 max-w-3xl border-t border-[var(--border)] pt-6">
                <input type="hidden" name="id" value={product.id} />
                <p className="mb-3 text-sm text-[var(--muted-foreground)]">
                    ¿Ya no lo vendes? Mejor desmarca «Visible en la tienda». Eliminar es definitivo.
                </p>
                <Button variant="outline" className="text-red-600">Eliminar producto</Button>
            </form>
        </div>
    )
}
