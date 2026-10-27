import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getStoreCategories, searchProducts, type ProductSort } from "@/lib/products"
import { ProductCard } from "@/components/shop/product-card"
import { cn } from "@/lib/utils"

type SearchParams = Promise<{ categoria?: string; q?: string; orden?: string; pagina?: string }>

const parsePage = (value?: string) => {
    const n = Number(value)
    return Number.isInteger(n) && n >= 1 ? n : 1
}

export async function generateMetadata(props: { searchParams: SearchParams }): Promise<Metadata> {
    const { categoria, q, orden, pagina } = await props.searchParams
    const categories = await getStoreCategories().catch(() => [] as string[])
    const activeCategory = categories.find((c) => c === categoria)
    const page = parsePage(pagina)
    const title = activeCategory ? `${activeCategory}: productos homeopáticos` : "Productos homeopáticos y sales de Schüssler"

    const canonical = new URLSearchParams()
    if (activeCategory) canonical.set("categoria", activeCategory)
    if (page > 1) canonical.set("pagina", String(page))
    const qs = canonical.toString()

    return {
        title: page > 1 ? `${title} (página ${page})` : title,
        description: activeCategory
            ? `Compra ${activeCategory.toLowerCase()} de Homeopáticos Schüssler. Entrega a domicilio en CDMX o recoge en sucursal en la Condesa.`
            : "Catálogo de productos homeopáticos y sales de Schüssler. Entrega a domicilio en CDMX o recoge en sucursal en la Condesa.",
        // Las búsquedas y el orden duplican contenido: no se indexan. La categoría y cada página conservan su URL canónica.
        alternates: { canonical: qs ? `/productos?${qs}` : "/productos" },
        robots: q?.trim() || orden ? { index: false, follow: true } : undefined,
    }
}

const sortOptions = [
    { value: "nombre", label: "Nombre" },
    { value: "precio-asc", label: "Precio: menor a mayor" },
    { value: "precio-desc", label: "Precio: mayor a menor" },
]

export default async function ProductsPage(props: { searchParams: SearchParams }) {
    const { categoria, q, orden, pagina } = await props.searchParams
    const categories = await getStoreCategories()
    const activeCategory = categories.find((c) => c === categoria)
    const query = q?.trim() ?? ""
    const page = parsePage(pagina)

    const activeSort = (sortOptions.find((o) => o.value === orden)?.value ?? "nombre") as ProductSort

    const { products: filtered, total, totalPages } = await searchProducts({ category: activeCategory, query, sort: activeSort, page })
    if (page > totalPages) notFound()

    // Al cambiar de categor\u00eda u orden se vuelve a la primera p\u00e1gina.
    const hrefFor = (category?: string, sort: string = activeSort, pageNumber = 1) => {
        const params = new URLSearchParams()
        if (category) params.set("categoria", category)
        if (query) params.set("q", query)
        if (sort !== "nombre") params.set("orden", sort)
        if (pageNumber > 1) params.set("pagina", String(pageNumber))
        const qs = params.toString()
        return qs ? `/productos?${qs}` : "/productos"
    }

    const linkClass = (active: boolean) =>
        cn(
            "rounded-full border border-[var(--border)] inline-flex min-h-10 items-center px-4 py-1 text-sm transition-colors hover:border-[var(--primary)]",
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
                    {total} {total === 1 ? "producto" : "productos"}
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
                <>
                <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
                    {filtered.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                {totalPages > 1 && (
                    <nav aria-label="Paginación" className="mt-10 flex flex-wrap items-center justify-center gap-2">
                        {page > 1 && (
                            <Link href={hrefFor(activeCategory, activeSort, page - 1)} rel="prev" className={linkClass(false)}>
                                Anterior
                            </Link>
                        )}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                            <Link
                                key={n}
                                href={hrefFor(activeCategory, activeSort, n)}
                                className={cn(linkClass(n === page), "min-w-10 justify-center")}
                                aria-label={`Página ${n}`}
                                aria-current={n === page ? "page" : undefined}
                            >
                                {n}
                            </Link>
                        ))}
                        {page < totalPages && (
                            <Link href={hrefFor(activeCategory, activeSort, page + 1)} rel="next" className={linkClass(false)}>
                                Siguiente
                            </Link>
                        )}
                    </nav>
                )}
                </>
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
