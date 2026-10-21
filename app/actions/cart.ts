'use server'

import { getProductsByIds } from "@/lib/products"

// Datos actuales (precio, disponibilidad) de lo que hay en el carrito del navegador.
// Los productos que ya no están publicados no se devuelven.
export async function refreshCart(ids: number[]) {
    const safeIds = [...new Set(ids)].filter((id) => Number.isInteger(id)).slice(0, 100)
    const found = await getProductsByIds(safeIds)
    return found.map((p) => ({
        id: Number(p.id),
        name: p.name,
        slug: p.slug,
        price: p.price,
        image: p.image,
        available: p.available,
    }))
}
