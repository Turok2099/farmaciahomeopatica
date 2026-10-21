'use client'

import { useActionState, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart/cart-provider"
import { WhatsAppButton } from "@/components/shop/whatsapp-button"
import { createCheckout } from "@/app/actions/checkout"

const money = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" })
const FREE_SHIPPING_OVER = 800
const field = "w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm"

export function CheckoutForm() {
    const { items, hydrated, subtotal } = useCart()
    const [state, action, pending] = useActionState(createCheckout, undefined)
    const [fulfillment, setFulfillment] = useState<"pickup" | "delivery">("pickup")

    if (!hydrated) return <p className="py-16 text-center text-[var(--muted-foreground)]" role="status">Cargando…</p>

    const available = items.filter((i) => i.available)
    if (available.length === 0) {
        return (
            <div className="rounded-lg border border-dashed border-[var(--border)] py-16 text-center">
                <p className="mb-4 text-[var(--muted-foreground)]">No hay productos para pagar.</p>
                <Link href="/productos" className="text-[var(--primary)] hover:underline">Ver productos</Link>
            </div>
        )
    }

    const deliveryAllowed = subtotal > FREE_SHIPPING_OVER
    const mode = deliveryAllowed ? fulfillment : "pickup"
    const err = (name: string) => state?.errors?.[name]?.[0]
    const hasUnavailable = items.length !== available.length

    const quoteMessage = [
        "Hola, quiero cotizar el envío a domicilio de mi pedido en Homeopáticos Schüssler:", "",
        ...available.map((i) => `• ${i.quantity} x ${i.name} (${money.format(i.price * i.quantity)})`), "",
        `Subtotal: ${money.format(subtotal)}`, "Mi código postal es: ",
    ].join("\n")

    return (
        <form action={action} className="grid gap-8 lg:grid-cols-3">
            <input type="hidden" name="cart" value={JSON.stringify(available.map((i) => ({ productId: i.productId, quantity: i.quantity })))} />
            <input type="hidden" name="fulfillment" value={mode} />

            <div className="space-y-8 lg:col-span-2">
                <section>
                    <h2 className="mb-4 text-lg font-semibold">Tus datos</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label htmlFor="name" className="mb-1 block text-sm font-medium">Nombre completo</label>
                            <input id="name" name="name" autoComplete="name" required className={field} />
                            {err("name") && <p className="mt-1 text-xs text-red-500">{err("name")}</p>}
                        </div>
                        <div>
                            <label htmlFor="email" className="mb-1 block text-sm font-medium">Correo</label>
                            <input id="email" name="email" type="email" autoComplete="email" required className={field} />
                            {err("email") && <p className="mt-1 text-xs text-red-500">{err("email")}</p>}
                        </div>
                        <div>
                            <label htmlFor="phone" className="mb-1 block text-sm font-medium">Teléfono (10 dígitos)</label>
                            <input id="phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel-national" required className={field} />
                            {err("phone") && <p className="mt-1 text-xs text-red-500">{err("phone")}</p>}
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="mb-4 text-lg font-semibold">Entrega</h2>
                    <div className="space-y-3">
                        <label className={`flex cursor-pointer gap-3 rounded-lg border p-4 ${mode === "pickup" ? "border-[var(--primary)]" : "border-[var(--border)]"}`}>
                            <input type="radio" name="fulfillment-choice" checked={mode === "pickup"} onChange={() => setFulfillment("pickup")} className="mt-1" />
                            <span>
                                <span className="block font-medium">Recoger en sucursal · Gratis</span>
                                <span className="text-sm text-[var(--muted-foreground)]">Alfonso Reyes 234, Ciudad de México. Te avisaremos cuando esté listo.</span>
                            </span>
                        </label>
                        <label className={`flex gap-3 rounded-lg border p-4 ${deliveryAllowed ? "cursor-pointer" : "opacity-70"} ${mode === "delivery" ? "border-[var(--primary)]" : "border-[var(--border)]"}`}>
                            <input type="radio" name="fulfillment-choice" disabled={!deliveryAllowed} checked={mode === "delivery"} onChange={() => setFulfillment("delivery")} className="mt-1" />
                            <span>
                                <span className="block font-medium">Entrega a domicilio en CDMX{deliveryAllowed ? " · Gratis" : ""}</span>
                                <span className="text-sm text-[var(--muted-foreground)]">
                                    {deliveryAllowed
                                        ? "Envío gratis en compras mayores a $800."
                                        : `Envío gratis en compras mayores a ${money.format(FREE_SHIPPING_OVER)}. Para entrega a domicilio con tu compra actual, cotiza el envío por WhatsApp.`}
                                </span>
                                {!deliveryAllowed && (
                                    <span className="mt-2 block"><WhatsAppButton message={quoteMessage}>Cotizar envío por WhatsApp</WhatsAppButton></span>
                                )}
                            </span>
                        </label>
                    </div>

                    {mode === "delivery" && (
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label htmlFor="street" className="mb-1 block text-sm font-medium">Calle y número (exterior e interior)</label>
                                <input id="street" name="street" autoComplete="address-line1" required className={field} />
                                {err("street") && <p className="mt-1 text-xs text-red-500">{err("street")}</p>}
                            </div>
                            <div>
                                <label htmlFor="neighborhood" className="mb-1 block text-sm font-medium">Colonia</label>
                                <input id="neighborhood" name="neighborhood" autoComplete="address-level3" required className={field} />
                                {err("neighborhood") && <p className="mt-1 text-xs text-red-500">{err("neighborhood")}</p>}
                            </div>
                            <div>
                                <label htmlFor="postalCode" className="mb-1 block text-sm font-medium">Código postal</label>
                                <input id="postalCode" name="postalCode" inputMode="numeric" maxLength={5} autoComplete="postal-code" required className={field} />
                                {err("postalCode") && <p className="mt-1 text-xs text-red-500">{err("postalCode")}</p>}
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="notes" className="mb-1 block text-sm font-medium">Referencias (opcional)</label>
                                <textarea id="notes" name="notes" rows={2} maxLength={200} className={field} placeholder="Entre calles, color del edificio, con quién dejar el paquete…" />
                            </div>
                        </div>
                    )}
                </section>
            </div>

            <aside className="h-fit rounded-lg border border-[var(--border)] bg-[var(--muted)] p-5">
                <h2 className="mb-4 text-lg font-semibold">Resumen</h2>
                <ul className="mb-4 space-y-2 text-sm">
                    {available.map((i) => (
                        <li key={i.productId} className="flex justify-between gap-3">
                            <span>{i.quantity} × {i.name}</span>
                            <span className="shrink-0">{money.format(i.price * i.quantity)}</span>
                        </li>
                    ))}
                </ul>
                <dl className="space-y-2 border-t border-[var(--border)] pt-3 text-sm">
                    <div className="flex justify-between"><dt>Subtotal</dt><dd>{money.format(subtotal)}</dd></div>
                    <div className="flex justify-between"><dt>Envío</dt><dd>$0.00</dd></div>
                    <div className="flex justify-between border-t border-[var(--border)] pt-3 text-base font-semibold"><dt>Total</dt><dd>{money.format(subtotal)}</dd></div>
                </dl>
                {hasUnavailable && (
                    <p className="mt-3 text-xs text-red-600">Hay productos agotados en tu carrito: no se incluirán. <Link href="/carrito" className="underline">Revisar carrito</Link></p>
                )}
                {state?.message && <p className="mt-3 text-sm text-red-500" role="alert">{state.message}</p>}
                <Button size="lg" className="mt-5 w-full" disabled={pending}>
                    {pending ? "Redirigiendo al pago…" : "Pagar con tarjeta"}
                </Button>
                <p className="mt-3 text-xs text-[var(--muted-foreground)]">Pagas en la página segura de Stripe. No guardamos los datos de tu tarjeta.</p>
                <Link href="/carrito" className="mt-3 block text-center text-sm text-[var(--primary)] hover:underline">Volver al carrito</Link>
            </aside>
        </form>
    )
}
