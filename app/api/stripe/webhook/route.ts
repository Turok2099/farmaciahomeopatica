import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { getStripe } from "@/lib/stripe"
import { cancelPendingOrder, markOrderPaid } from "@/lib/orders"

export const runtime = "nodejs"

export async function POST(request: Request) {
    const secret = process.env.STRIPE_WEBHOOK_SECRET
    const signature = request.headers.get("stripe-signature")
    if (!secret || !signature) {
        return NextResponse.json({ error: "Webhook no configurado" }, { status: 400 })
    }

    // Se verifica la firma con el cuerpo EXACTO, sin parsear.
    const body = await request.text()
    let event: Stripe.Event
    try {
        event = getStripe().webhooks.constructEvent(body, signature, secret)
    } catch {
        return NextResponse.json({ error: "Firma inválida" }, { status: 400 })
    }

    try {
        switch (event.type) {
            case "checkout.session.completed":
            case "checkout.session.async_payment_succeeded": {
                const session = event.data.object as Stripe.Checkout.Session
                if (session.payment_status === "paid") {
                    const intent = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null
                    await markOrderPaid(session.id, session.amount_total, intent)
                }
                break
            }
            case "checkout.session.expired":
            case "checkout.session.async_payment_failed": {
                const session = event.data.object as Stripe.Checkout.Session
                await cancelPendingOrder(session.id)
                break
            }
        }
    } catch (error) {
        console.error("Webhook de Stripe: error al procesar", event.type, error instanceof Error ? error.message : error)
        return NextResponse.json({ error: "Error al procesar" }, { status: 500 }) // Stripe reintenta
    }

    return NextResponse.json({ received: true })
}
