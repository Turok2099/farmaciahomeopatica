import Stripe from "stripe";

let client: Stripe | null = null;

export function getStripe() {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("Falta STRIPE_SECRET_KEY.");
    client ??= new Stripe(key);
    return client;
}

// URL pública del sitio, para los enlaces de regreso desde Stripe.
export function siteUrl() {
    return (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}
