import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Política de contenido. Next inyecta scripts y estilos en línea para hidratar, por eso 'unsafe-inline'
// (con nonces habría que renderizar todo de forma dinámica). En desarrollo, React necesita 'unsafe-eval'.
// Orígenes permitidos: imágenes y subida directa a Cloudinary, mapa embebido de Google, y Stripe Checkout
// como destino del formulario de pago (la compra redirige a su página alojada), y Google Analytics (gtag.js y envío de
// eventos; solo se carga si el visitante acepta las cookies de analítica).
const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://res.cloudinary.com https://*.google-analytics.com https://*.googletagmanager.com",
    "font-src 'self' data:",
    `connect-src 'self' https://api.cloudinary.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com${isDev ? " ws: wss:" : ""}`,
    "frame-src https://www.google.com",
    "form-action 'self' https://checkout.stripe.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "object-src 'none'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
    { key: "Content-Security-Policy", value: csp },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
    { key: "Strict-Transport-Security", value: "max-age=31536000" },
];

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
        ],
    },
    async headers() {
        return [{ source: "/:path*", headers: securityHeaders }];
    },
};

export default nextConfig;
