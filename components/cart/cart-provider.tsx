'use client'

import { useSyncExternalStore } from "react"
import { refreshCart } from "@/app/actions/cart"

export interface CartItem {
    productId: number
    slug: string
    name: string
    price: number // MXN; solo para mostrar, el pago recalcula en el servidor
    image: string
    available: boolean
    quantity: number
}

type NewItem = Omit<CartItem, "quantity" | "available">
interface CartState { items: CartItem[]; hydrated: boolean }

const STORAGE_KEY = "schussler-cart-v1"
export const MAX_QUANTITY = 99

const SERVER_STATE: CartState = { items: [], hydrated: false }
let state: CartState = SERVER_STATE
const listeners = new Set<() => void>()

const clamp = (value: number) => Math.min(MAX_QUANTITY, Math.max(1, Math.floor(value) || 1))

function readStorage(): CartItem[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        const parsed = raw ? JSON.parse(raw) : []
        if (!Array.isArray(parsed)) return []
        return parsed
            .filter((i) => i && Number.isInteger(i.productId) && typeof i.name === "string" && typeof i.price === "number")
            .map((i) => ({ ...i, quantity: clamp(i.quantity), available: i.available !== false }))
    } catch {
        return []
    }
}

function commit(items: CartItem[]) {
    state = { items, hydrated: true }
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) } catch { /* modo privado */ }
    listeners.forEach((l) => l())
}

// Trae precio y disponibilidad actuales; descarta productos retirados de la tienda.
function syncWithServer() {
    const ids = state.items.map((i) => i.productId)
    if (ids.length === 0) return
    refreshCart(ids)
        .then((fresh) => {
            const byId = new Map(fresh.map((p) => [p.id, p]))
            commit(
                state.items
                    .filter((i) => byId.has(i.productId))
                    .map((i) => {
                        const p = byId.get(i.productId)!
                        return { ...i, name: p.name, slug: p.slug, price: p.price, image: p.image, available: p.available }
                    })
            )
        })
        .catch(() => { /* sin red: se conserva lo guardado */ })
}

function onStorage(e: StorageEvent) {
    if (e.key !== STORAGE_KEY) return
    state = { items: readStorage(), hydrated: true }
    listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
    listeners.add(listener)
    if (listeners.size === 1) window.addEventListener("storage", onStorage)
    if (!state.hydrated) {
        state = { items: readStorage(), hydrated: true }
        syncWithServer()
    }
    return () => {
        listeners.delete(listener)
        if (listeners.size === 0) window.removeEventListener("storage", onStorage)
    }
}

const actions = {
    add(item: NewItem, quantity = 1) {
        const existing = state.items.find((i) => i.productId === item.productId)
        commit(existing
            ? state.items.map((i) => i.productId === item.productId ? { ...i, quantity: clamp(i.quantity + quantity) } : i)
            : [...state.items, { ...item, available: true, quantity: clamp(quantity) }])
    },
    setQuantity(productId: number, quantity: number) {
        commit(state.items.map((i) => i.productId === productId ? { ...i, quantity: clamp(quantity) } : i))
    },
    remove(productId: number) {
        commit(state.items.filter((i) => i.productId !== productId))
    },
    clear() {
        commit([])
    },
}

export function useCart() {
    const { items, hydrated } = useSyncExternalStore(subscribe, () => state, () => SERVER_STATE)
    return {
        items,
        hydrated,
        count: items.reduce((n, i) => n + i.quantity, 0),
        subtotal: items.reduce((n, i) => n + (i.available ? i.price * i.quantity : 0), 0),
        ...actions,
    }
}
