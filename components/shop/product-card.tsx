import Link from "next/link"
import { Product } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-sm transition-all hover:shadow-md">
            <div className="aspect-square w-full overflow-hidden bg-[var(--muted)] relative">
                {/* Placeholder for real image */}
                <div className="absolute inset-0 flex items-center justify-center text-[var(--muted-foreground)] selection:bg-none">
                    {product.name.substring(0, 2)}
                </div>
            </div>
            <div className="p-4">
                <div className="mb-2 text-xs font-medium text-[var(--muted-foreground)]">
                    {product.category}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                    <Link href={`/productos/${product.slug}`}>
                        {product.name}
                    </Link>
                </h3>
                <p className="mb-4 text-sm text-[var(--muted-foreground)] line-clamp-2">
                    {product.description}
                </p>
                <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-[var(--primary)]">
                        ${product.price.toFixed(2)}
                    </span>
                    <Button size="sm" variant="secondary">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Agregar
                    </Button>
                </div>
            </div>
        </div>
    )
}
