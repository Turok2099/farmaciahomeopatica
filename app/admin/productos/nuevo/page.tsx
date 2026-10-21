import { asc } from "drizzle-orm"
import { db } from "@/lib/db"
import { categories } from "@/lib/schema"
import { requireRole } from "@/lib/auth"
import { ProductForm } from "@/components/admin/product-form"

export default async function NewProductPage() {
    await requireRole("admin")
    const cats = await db.select({ id: categories.id, name: categories.name }).from(categories).orderBy(asc(categories.name))

    return (
        <div>
            <h1 className="mb-6 text-2xl font-semibold">Nuevo producto</h1>
            <ProductForm
                cloudName={process.env.CLOUDINARY_CLOUD_NAME ?? ""}
                categories={cats}
                values={{
                    name: "", slug: "", price: "", categoryId: "", presentation: "", description: "",
                    imageId: "", available: true, published: true, featured: false,
                }}
            />
        </div>
    )
}
