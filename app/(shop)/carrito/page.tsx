import { CartView } from "@/components/cart/cart-view"

export const metadata = {
    title: "Carrito de Compras",
    robots: { index: false, follow: true },
}

export default function CartPage() {
    return (
        <div className="container-custom py-10">
            <h1 className="text-3xl font-bold mb-8">Carrito de compras</h1>
            <CartView />
        </div>
    )
}
