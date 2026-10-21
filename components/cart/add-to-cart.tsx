'use client'

import { useEffect, useRef, useState } from "react"
import { Check, Minus, Plus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MAX_QUANTITY, useCart } from "@/components/cart/cart-provider"
import type { Product } from "@/lib/products"

function useAddedFeedback() {
    const [added, setAdded] = useState(false)
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
    useEffect(() => () => clearTimeout(timer.current), [])
    return [added, () => {
        setAdded(true)
        clearTimeout(timer.current)
        timer.current = setTimeout(() => setAdded(false), 1800)
    }] as const
}

const toItem = (product: Product) => ({
    productId: Number(product.id),
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: product.image,
})

// Botón compacto para las tarjetas del catálogo.
export function AddToCartButton({ product }: { product: Product }) {
    const { add } = useCart()
    const [added, flash] = useAddedFeedback()

    return (
        <Button
            size="sm"
            variant="default"
            className="relative z-10"
            disabled={!product.available}
            onClick={() => { add(toItem(product)); flash() }}
        >
            {added ? <Check className="mr-2 h-4 w-4" /> : <ShoppingCart className="mr-2 h-4 w-4" />}
            {added ? "Agregado" : "Agregar"}
            <span className="sr-only" role="status">{added ? `${product.name} agregado al carrito` : ""}</span>
        </Button>
    )
}

// Selector de cantidad + botón grande para la ficha del producto.
export function ProductPurchase({ product }: { product: Product }) {
    const { add } = useCart()
    const [quantity, setQuantity] = useState(1)
    const [added, flash] = useAddedFeedback()

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center rounded-md border border-[var(--border)]">
                <button
                    type="button"
                    aria-label="Disminuir cantidad"
                    className="px-3 py-2 hover:bg-[var(--muted)] disabled:opacity-40"
                    disabled={quantity <= 1 || !product.available}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                    <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-[3ch] border-x border-[var(--border)] px-3 py-2 text-center" aria-live="polite">{quantity}</span>
                <button
                    type="button"
                    aria-label="Aumentar cantidad"
                    className="px-3 py-2 hover:bg-[var(--muted)] disabled:opacity-40"
                    disabled={quantity >= MAX_QUANTITY || !product.available}
                    onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
                >
                    <Plus className="h-4 w-4" />
                </button>
            </div>
            <Button
                size="lg"
                className="flex-1"
                disabled={!product.available}
                onClick={() => { add(toItem(product), quantity); flash(); setQuantity(1) }}
            >
                {added ? <Check className="mr-2 h-5 w-5" /> : <ShoppingCart className="mr-2 h-5 w-5" />}
                {product.available ? (added ? "Agregado al carrito" : "Agregar al carrito") : "Agotado"}
                <span className="sr-only" role="status">{added ? `${product.name} agregado al carrito` : ""}</span>
            </Button>
        </div>
    )
}
