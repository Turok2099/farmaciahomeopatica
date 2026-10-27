'use client'

import Link from "next/link"
import { DeliveryPromise } from "@/components/shop/delivery-promise"
import { ArrowLeftIcon, MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"
import { MAX_QUANTITY, useCart } from "@/components/cart/cart-provider"
import { WhatsAppButton } from "@/components/shop/whatsapp-button"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"

const money = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" })
const FREE_SHIPPING_OVER = 800

export function CartView() {
    const { items, hydrated, subtotal, setQuantity, remove } = useCart()

    if (!hydrated) {
        return <p className="py-16 text-center text-[var(--muted-foreground)]" role="status">Cargando carrito…</p>
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[var(--border)] bg-[var(--muted)] py-16">
                <p className="mb-4 text-[var(--muted-foreground)]">Tu carrito está vacío</p>
                <Link href="/productos">
                    <Button><ArrowLeftIcon className="mr-2 h-4 w-4" />Explorar productos</Button>
                </Link>
            </div>
        )
    }

    const hasUnavailable = items.some((i) => !i.available)
    const missing = Math.max(0, FREE_SHIPPING_OVER - subtotal)
    const freeShipping = subtotal > FREE_SHIPPING_OVER

    const quoteMessage = [
        "Hola, quiero cotizar el envío a domicilio de mi pedido en Homeopáticos Schüssler:",
        "",
        ...items.filter((i) => i.available).map((i) => `• ${i.quantity} x ${i.name} (${money.format(i.price * i.quantity)})`),
        "",
        `Subtotal: ${money.format(subtotal)}`,
        "Mi código postal es: ",
    ].join("\n")

    return (
        <div className="grid gap-8 lg:grid-cols-3">
            <ul className="divide-y divide-[var(--border)] rounded-lg border border-[var(--border)] lg:col-span-2">
                {items.map((item) => (
                    <li key={item.productId} className="flex gap-4 p-4">
                        <Link href={`/productos/${item.slug}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-[var(--border)] bg-white">
                            {item.image ? (
                                <CloudinaryImage src={item.image} alt="" sizes="80px" className="object-contain p-1" />
                            ) : (
                                <span className="flex h-full w-full items-center justify-center bg-[var(--muted)] text-lg font-semibold text-[var(--muted-foreground)]">
                                    {item.name.substring(0, 2)}
                                </span>
                            )}
                        </Link>
                        <div className="flex flex-1 flex-col gap-2">
                            <div className="flex justify-between gap-4">
                                <Link href={`/productos/${item.slug}`} className="font-medium hover:text-[var(--primary)]">{item.name}</Link>
                                <span className="font-semibold">{money.format(item.price * item.quantity)}</span>
                            </div>
                            <p className="text-sm text-[var(--muted-foreground)]">{money.format(item.price)} c/u</p>
                            {!item.available && (
                                <p className="text-sm font-medium text-red-600">Agotado: no se incluye en el total. Quítalo para continuar.</p>
                            )}
                            <div className="mt-auto flex items-center justify-between">
                                <div className="flex items-center rounded-md border border-[var(--border)]">
                                    <button
                                        type="button"
                                        aria-label={`Disminuir cantidad de ${item.name}`}
                                        className="px-2.5 py-1.5 hover:bg-[var(--muted)] disabled:opacity-40"
                                        disabled={item.quantity <= 1}
                                        onClick={() => setQuantity(item.productId, item.quantity - 1)}
                                    >
                                        <MinusIcon className="h-4 w-4" />
                                    </button>
                                    <span className="min-w-[3ch] border-x border-[var(--border)] px-3 py-1.5 text-center text-sm" aria-live="polite">{item.quantity}</span>
                                    <button
                                        type="button"
                                        aria-label={`Aumentar cantidad de ${item.name}`}
                                        className="px-2.5 py-1.5 hover:bg-[var(--muted)] disabled:opacity-40"
                                        disabled={item.quantity >= MAX_QUANTITY}
                                        onClick={() => setQuantity(item.productId, item.quantity + 1)}
                                    >
                                        <PlusIcon className="h-4 w-4" />
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => remove(item.productId)}
                                    className="flex items-center gap-1 text-sm text-[var(--muted-foreground)] hover:text-red-600"
                                >
                                    <TrashIcon className="h-4 w-4" /> Quitar
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            <aside className="h-fit rounded-lg border border-[var(--border)] bg-[var(--muted)] p-5">
                <DeliveryPromise className="mb-4" />
                <h2 className="mb-4 text-lg font-semibold">Resumen</h2>
                <dl className="space-y-2 text-sm">
                    <div className="flex justify-between"><dt>Subtotal</dt><dd>{money.format(subtotal)}</dd></div>
                    <div className="flex justify-between text-[var(--muted-foreground)]">
                        <dt>Envío a domicilio</dt><dd>{freeShipping ? "Gratis" : "Por cotizar"}</dd>
                    </div>
                    <div className="flex justify-between border-t border-[var(--border)] pt-3 text-base font-semibold">
                        <dt>Total</dt><dd>{money.format(subtotal)}</dd>
                    </div>
                </dl>
                <p className="mt-3 text-xs text-[var(--muted-foreground)]">
                    {freeShipping
                        ? "Tu compra califica para envío gratis a domicilio en CDMX."
                        : `Te faltan ${money.format(missing)} para envío gratis a domicilio en CDMX. También puedes recoger en sucursal sin costo.`}
                </p>
                {!freeShipping && (
                    <div className="mt-4 rounded-md border border-[var(--border)] bg-[var(--background)] p-3">
                        <p className="mb-2 text-sm">¿Quieres entrega a domicilio? Te confirmamos el costo del envío según tu código postal.</p>
                        <WhatsAppButton message={quoteMessage} className="w-full">Cotizar envío por WhatsApp</WhatsAppButton>
                    </div>
                )}
                {hasUnavailable || subtotal <= 0 ? (
                    <Button size="lg" className="mt-5 w-full" disabled>Continuar al pago</Button>
                ) : (
                    <Link href="/checkout" className="mt-5 block">
                        <Button size="lg" className="w-full">Continuar al pago</Button>
                    </Link>
                )}
                {hasUnavailable && <p className="mt-2 text-xs text-red-600">Quita los productos agotados para continuar.</p>}
            </aside>
        </div>
    )
}
