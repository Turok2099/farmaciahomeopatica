import { products } from "@/lib/data"
import { ProductCard } from "@/components/shop/product-card"

export const metadata = {
    title: "Nuestros Productos | Medicamento Homeopáticos Schussler",
    description: "Catálogo completo de medicamentos homeopáticos.",
}

export default function ProductsPage() {
    return (
        <div className="container-custom py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Nuestros Productos</h1>
                <p className="text-[var(--muted-foreground)]">Explora nuestra colección completa de soluciones naturales.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar Filters (Mock) */}
                <div className="hidden md:block space-y-6">
                    <div>
                        <h3 className="font-semibold mb-3">Categorías</h3>
                        <div className="space-y-2 text-sm">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="rounded border-gray-300" /> Dolor
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="rounded border-gray-300" /> Estrés
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="rounded border-gray-300" /> Digestión
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="rounded border-gray-300" /> Gripe y Resfriado
                            </label>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3">Precio</h3>
                        <div className="space-y-2 text-sm">
                            <input type="range" className="w-full accent-[var(--primary)]" />
                            <div className="flex justify-between text-xs text-[var(--muted-foreground)]">
                                <span>$0</span>
                                <span>$500+</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="md:col-span-3">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
