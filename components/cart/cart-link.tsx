'use client'

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart/cart-provider"

export function CartLink() {
    const { count, hydrated } = useCart()
    const shown = hydrated ? count : 0

    return (
        <Link href="/carrito" aria-label={shown > 0 ? `Carrito, ${shown} artículos` : "Carrito"}>
            <Button variant="ghost" size="icon" className="relative hover:bg-white/15 hover:text-white" tabIndex={-1}>
                <ShoppingCart className="h-5 w-5" />
                {shown > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-semibold text-[var(--brand)]">
                        {shown > 99 ? "99+" : shown}
                    </span>
                )}
            </Button>
        </Link>
    )
}
