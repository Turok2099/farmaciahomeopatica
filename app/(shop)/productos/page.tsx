import Link from "next/link"
import { getProducts, getStoreCategories } from "@/lib/products"
import { ProductCard } from "@/components/shop/product-card"
import { cn } from "@/lib/utils"

export const metadata = {
    title: "Nuestros Productos | Homeopáticos Schüssler",
    description: "Catálogo completo de productos de Homeopáticos Schüssler.",
}

const sortOptions = [
    { value: "nombre", label: "Nombre" },
    { value: "precio-asc", label: "Precio: menor a mayor" },
    { value: "precio-desc", label: "Precio: mayor a menor" },
]

const normalize = (value: string) =>
    value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

export default async function ProductsPage(props: {
    searchParams: Promise<{ categoria?: string; q?: string; orden?: string }>
}) {
    const { categoria, q, orden } = await props.searchParams
    const [products, categories] = await Promise.all([getProducts(), getStoreCategories()])
    const activeCategory = categories.find((c) => c === categoria)
    const query = q?.trim() ?? ""

    const activeSort = sortOptions.find((o) => o.value === orden)?.value ?? "nombre"

    const filtered = products.filter(
        (p) =>
            (!activeCategory || p.category === activeCategory) &&
            (!query || normalize(p.name).includes(normalize(query)))
    )

    filtered.sort((a, b) =>
        activeSort === "precio-asc" ? a.price - b.price
        : activeSort === "precio-desc" ? b.price - a.price
        : a.name.localeCompare(b.name, "es")
    )

    const hrefFor = (category?: string, sort: string = activeSort) => {
        const params = new URLSearchParams()
        if (category) params.set("categoria", category)
        if (query) params.set("q", query)
        if (sort !== "nombre") params.set("orden", sort)
        const qs = params.toString()
        return qs ? `/productos?${qs}` : "/productos"
    }

    const linkClass = (active: boolean) =>
        cn(
            "rounded-full border border-[var(--border)] px-3 py-1 text-sm transition-colors hover:border-[var(--primary)]",
            active && "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]"
        )

    return (
        <div className="container-custom py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Nuestros Productos</h1>
                <p className="text-[var(--muted-foreground)]">
                    {query ? `Resultados para “${query}”` : "Explora nuestro catálogo completo."}
                </p>
            </div>

            <nav aria-label="Categorías" className="mb-8 flex flex-wrap gap-2">
                <Link href={hrefFor()} className={linkClass(!activeCategory)} aria-current={!activeCategory ? "true" : undefined}>
                    Todos
                </Link>
                {categories.map((category) => (
                    <Link
                        key={category}
                        href={hrefFor(category)}
                        className={linkClass(category === activeCategory)}
                        aria-current={category === activeCategory ? "true" : undefined}
                    >
                        {category}
                    </Link>
                ))}
            </nav>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm">
                <p className="text-[var(--muted-foreground)]">
                    {filtered.length} {filtered.length === 1 ? "producto" : "productos"}
                    {activeCategory && <> en <strong className="text-[var(--foreground)]">{activeCategory}</strong></>}
                    {(activeCategory || query) && (
                        <> · <Link href="/productos" className="text-[var(--primary)] hover:underline">Quitar filtros</Link></>
                    )}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[var(--muted-foreground)]">Ordenar por:</span>
                    {sortOptions.map((option) => (
                        <Link
                            key={option.value}
                            href={hrefFor(activeCategory, option.value)}
                            className={linkClass(option.value === activeSort)}
                            aria-current={option.value === activeSort ? "true" : undefined}
                        >
                            {option.label}
                        </Link>
                    ))}
                </div>
            </div>

            {filtered.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
                    {filtered.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="rounded-lg border border-dashed border-[var(--border)] py-16 text-center">
                    <p className="mb-4 text-[var(--muted-foreground)]">No encontramos productos con esos criterios.</p>
                    <Link href="/productos" className="text-[var(--primary)] hover:underline">
                        Ver todos los productos
                    </Link>
                </div>
            )}
        </div>
    )
}
