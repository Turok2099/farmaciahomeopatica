import type { Metadata } from "next"
import { CheckoutForm } from "@/components/cart/checkout-form"

export const metadata: Metadata = {
    title: "Finalizar compra",
    robots: { index: false, follow: false },
}

export default function CheckoutPage() {
    return (
        <div className="container-custom py-10">
            <h1 className="mb-8 text-3xl font-bold">Finalizar compra</h1>
            <CheckoutForm />
        </div>
    )
}
