'use server'

import { randomBytes } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { db } from '@/lib/db'
import { orders, orderItems } from '@/lib/schema'
import { getProductsByIds } from '@/lib/products'
import { getStripe, siteUrl } from '@/lib/stripe'
import { getSession } from '@/lib/session'
import { FREE_SHIPPING_OVER_CENTS, isCdmxPostalCode } from '@/lib/orders'

export type CheckoutState = { message?: string; errors?: Record<string, string[]> } | undefined

const CartSchema = z.array(
    z.object({ productId: z.number().int().positive(), quantity: z.number().int().min(1).max(99) })
).min(1, 'Tu carrito está vacío.').max(50)

const BaseSchema = z.object({
    name: z.string().trim().min(2, 'Escribe tu nombre.').max(100),
    email: z.string().trim().toLowerCase().pipe(z.email('Correo inválido.')),
    phone: z.string().transform((v) => v.replace(/\D/g, '')).pipe(z.string().regex(/^\d{10}$/, 'Escribe 10 dígitos.')),
    fulfillment: z.enum(['delivery', 'pickup']),
    street: z.string().trim().max(150).default(''),
    neighborhood: z.string().trim().max(100).default(''),
    postalCode: z.string().trim().default(''),
    notes: z.string().trim().max(200).default(''),
})

export async function createCheckout(prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
    const parsed = BaseSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        fulfillment: formData.get('fulfillment'),
        street: formData.get('street') ?? '',
        neighborhood: formData.get('neighborhood') ?? '',
        postalCode: formData.get('postalCode') ?? '',
        notes: formData.get('notes') ?? '',
    })
    if (!parsed.success) return { errors: z.flattenError(parsed.error).fieldErrors }
    const data = parsed.data

    if (data.fulfillment === 'delivery') {
        const errors: Record<string, string[]> = {}
        if (data.street.length < 3) errors.street = ['Escribe calle y número.']
        if (data.neighborhood.length < 2) errors.neighborhood = ['Escribe tu colonia.']
        if (!isCdmxPostalCode(data.postalCode)) errors.postalCode = ['Solo entregamos en la Ciudad de México (CP 01000 a 16999).']
        if (Object.keys(errors).length) return { errors }
    }

    // El carrito viene del navegador: solo se usan ids y cantidades; precios y disponibilidad se leen de la base.
    let cart: z.infer<typeof CartSchema>
    try {
        cart = CartSchema.parse(JSON.parse(String(formData.get('cart') ?? '[]')))
    } catch {
        return { message: 'No pudimos leer tu carrito. Vuelve al carrito e inténtalo de nuevo.' }
    }
    const quantities = new Map<number, number>()
    for (const line of cart) quantities.set(line.productId, Math.min(99, (quantities.get(line.productId) ?? 0) + line.quantity))

    const found = await getProductsByIds([...quantities.keys()])
    const byId = new Map(found.map((p) => [Number(p.id), p]))
    const unavailable = [...quantities.keys()].filter((id) => !byId.get(id)?.available)
    if (unavailable.length) {
        const names = unavailable.map((id) => byId.get(id)?.name ?? 'Un producto').join(', ')
        return { message: `Ya no está disponible: ${names}. Quítalo del carrito para continuar.` }
    }

    const lines = [...quantities.entries()].map(([id, quantity]) => {
        const p = byId.get(id)!
        return { productId: id, name: p.name, image: p.image, unitPriceCents: Math.round(p.price * 100), quantity }
    })
    const subtotalCents = lines.reduce((n, l) => n + l.unitPriceCents * l.quantity, 0)

    if (data.fulfillment === 'delivery' && subtotalCents <= FREE_SHIPPING_OVER_CENTS) {
        return { message: 'La entrega a domicilio con envío incluido aplica en compras mayores a $800. Cotiza tu envío por WhatsApp o elige recoger en sucursal.' }
    }

    const session = await getSession()
    const userId = Number(session?.userId) || null
    const publicId = randomBytes(16).toString('hex')
    const isDelivery = data.fulfillment === 'delivery'

    const [order] = await db.insert(orders).values({
        publicId,
        userId,
        fulfillment: data.fulfillment,
        customerName: data.name,
        customerEmail: data.email,
        customerPhone: data.phone,
        addressStreet: isDelivery ? data.street : '',
        addressNeighborhood: isDelivery ? data.neighborhood : '',
        addressPostalCode: isDelivery ? data.postalCode : '',
        addressNotes: isDelivery ? data.notes : '',
        subtotalCents,
        shippingCents: 0,
        totalCents: subtotalCents,
    }).returning({ id: orders.id })

    await db.insert(orderItems).values(lines.map((l) => ({
        orderId: order.id, productId: l.productId, name: l.name, unitPriceCents: l.unitPriceCents, quantity: l.quantity,
    })))

    let checkoutUrl: string | null = null
    try {
        const stripe = getStripe()
        const checkout = await stripe.checkout.sessions.create({
            mode: 'payment',
            locale: 'es',
            customer_email: data.email,
            client_reference_id: publicId,
            metadata: { orderId: String(order.id), publicId },
            payment_intent_data: { description: `Pedido #${order.id} · Homeopáticos Schüssler`, metadata: { orderId: String(order.id) } },
            line_items: lines.map((l) => ({
                quantity: l.quantity,
                price_data: {
                    currency: 'mxn',
                    unit_amount: l.unitPriceCents,
                    product_data: { name: l.name, ...(l.image ? { images: [l.image] } : {}) },
                },
            })),
            expires_at: Math.floor(Date.now() / 1000) + 31 * 60,
            success_url: `${siteUrl()}/checkout/exito?pedido=${publicId}`,
            cancel_url: `${siteUrl()}/carrito`,
        })
        await db.update(orders).set({ stripeSessionId: checkout.id }).where(eq(orders.id, order.id))
        checkoutUrl = checkout.url
    } catch (error) {
        console.error('Stripe: no se pudo crear la sesión de pago', error instanceof Error ? error.message : error)
        await db.update(orders).set({ status: 'cancelled' }).where(eq(orders.id, order.id))
        return { message: 'No pudimos iniciar el pago. Inténtalo de nuevo en unos minutos.' }
    }

    if (!checkoutUrl) return { message: 'No pudimos iniciar el pago. Inténtalo de nuevo.' }
    redirect(checkoutUrl)
}
