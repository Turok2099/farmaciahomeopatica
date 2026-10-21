import Link from "next/link"
import type { Product } from "@/lib/products"
import { AddToCartButton } from "@/components/cart/add-to-cart"

interface ProductCardProps {
    product: Product
}

const priceFormat = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" })

export function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="group relative flex flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)] transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-[var(--primary)]">
            <div className="relative aspect-square w-full overflow-hidden bg-white">
                {product.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-contain p-4"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[var(--muted)] text-2xl font-semibold text-[var(--muted-foreground)] selection:bg-transparent">
                        {product.name.substring(0, 2)}
                    </div>
                )}
            </div>
            <div className="flex flex-1 flex-col p-3 sm:p-4">
                <div className="mb-1 text-xs font-medium text-[var(--muted-foreground)]">
                    {product.category}
                </div>
                {!product.available && <span className="mb-1 text-xs font-semibold text-red-600">Agotado</span>}
                <h3 className="mb-2 text-base font-semibold leading-snug text-[var(--foreground)] transition-colors group-hover:text-[var(--primary)]">
                    <Link href={`/productos/${product.slug}`} className="after:absolute after:inset-0">
                        {product.name}
                    </Link>
                </h3>
                {product.description && (
                    <p className="mb-3 text-sm text-[var(--muted-foreground)] line-clamp-2">
                        {product.description}
                    </p>
                )}
                <div className="mt-auto flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-lg font-bold text-[var(--foreground)]">
                        {priceFormat.format(product.price)}
                    </span>
                    <AddToCartButton product={product} />
                </div>
            </div>
        </div>
    )
}
