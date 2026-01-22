import { notFound } from "next/navigation"
import { products } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check, Shield } from "lucide-react"
import Link from "next/link"

export async function generateMetadata(
    props: {
        params: Promise<{ slug: string }>;
    }
) {
    const params = await props.params;
    const product = products.find((p) => p.slug === params.slug)
    if (!product) return { title: "Producto no encontrado" }

    return {
        title: `${product.name} | Medicamento Homeopáticos Schussler`,
        description: product.description,
    }
}

export default async function ProductPage(
    props: {
        params: Promise<{ slug: string }>;
    }
) {
    const params = await props.params;
    const product = products.find((p) => p.slug === params.slug)

    if (!product) {
        notFound()
    }

    return (
        <div className="container-custom py-10">
            <div className="mb-6 text-sm text-[var(--muted-foreground)]">
                <Link href="/productos" className="hover:text-[var(--primary)]">Productos</Link>
                <span className="mx-2">/</span>
                <span className="text-[var(--foreground)]">{product.name}</span>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
                {/* Product Image Placeholder */}
                <div className="aspect-square bg-[var(--muted)] rounded-xl overflow-hidden border border-[var(--border)] relative">
                    {product.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-[var(--muted-foreground)] text-4xl font-bold">
                            {product.name.charAt(0)}
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="flex flex-col justify-center">
                    <div className="mb-2">
                        <span className="inline-block rounded-full bg-[var(--secondary)] px-3 py-1 text-xs font-semibold text-[var(--secondary-foreground)]">
                            {product.category}
                        </span>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                    <p className="text-xl text-[var(--muted-foreground)] mb-6">{product.description}</p>

                    <div className="flex items-center gap-4 mb-8">
                        <span className="text-3xl font-bold text-[var(--primary)]">${product.price.toFixed(2)}</span>
                        {product.inStock ? (
                            <span className="flex items-center text-sm text-[var(--accent)] font-medium bg-[var(--accent)]/10 px-2 py-1 rounded">
                                <Check className="mr-1 h-3 w-3" /> Disponible
                            </span>
                        ) : (
                            <span className="text-sm text-red-500 font-medium">Agotado</span>
                        )}
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center rounded-md border border-[var(--border)]">
                                <button className="px-3 py-2 hover:bg-[var(--muted)]">-</button>
                                <span className="px-3 py-2 border-x border-[var(--border)] min-w-[3ch] text-center">1</span>
                                <button className="px-3 py-2 hover:bg-[var(--muted)]">+</button>
                            </div>
                            <Button size="lg" className="flex-1">
                                <ShoppingCart className="mr-2 h-5 w-5" /> Agregar al Carrito
                            </Button>
                        </div>
                    </div>

                    <div className="border-t border-[var(--border)] pt-6 space-y-4">
                        <div className="flex items-start gap-3">
                            <Shield className="h-5 w-5 text-[var(--primary)] mt-0.5" />
                            <div>
                                <h4 className="font-medium text-sm">Garantía de Calidad</h4>
                                <p className="text-xs text-[var(--muted-foreground)]">Producto verificado por expertos homeópatas.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
