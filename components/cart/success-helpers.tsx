'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/cart/cart-provider"

// Vacía el carrito del navegador cuando el pedido ya está pagado.
export function ClearCart() {
    const { clear } = useCart()
    useEffect(() => { clear() }, [clear])
    return null
}

// Mientras el pago se confirma, vuelve a consultar el pedido cada 3 s (máximo 10 veces).
export function Refresh() {
    const router = useRouter()
    useEffect(() => {
        let attempts = 0
        const timer = setInterval(() => {
            attempts += 1
            router.refresh()
            if (attempts >= 10) clearInterval(timer)
        }, 3000)
        return () => clearInterval(timer)
    }, [router])
    return null
}
