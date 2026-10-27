import type { Metadata } from "next"
import { JsonLd } from "@/components/seo/json-ld"

const faqs = [
    { q: "¿A dónde entregan?", a: "Solo en la Ciudad de México." },
    { q: "¿Cuánto cuesta el envío?", a: "Es gratuito en compras superiores a $800 MXN. En compras menores se calcula según tu código postal." },
    { q: "¿Puedo recoger mi pedido?", a: "Sí, en nuestra sucursal de Alfonso Reyes 234, Col. Condesa, Ciudad de México." },
    { q: "¿Cuál es el horario de la sucursal?", a: "Lunes a viernes de 10:00 a 18:00 h y sábados de 10:00 a 17:00 h." },
    { q: "¿Cómo los contacto?", a: "Por correo a contacto@schussler.com.mx." },
]

const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
}

export const metadata: Metadata = {
    title: "Preguntas frecuentes",
    alternates: { canonical: "/faq" },
    description: "Respuestas sobre entregas, horarios y contacto de Homeopáticos Schüssler.",
}

export default function Page() {
    return (
        <div className="container-custom max-w-3xl py-10">
            <JsonLd data={structuredData} />
            <h1 className="text-3xl font-bold mb-6">Preguntas frecuentes</h1>
            <div className="space-y-4 text-[var(--muted-foreground)]">
                <h2 className="text-xl font-semibold text-[var(--foreground)]">¿A dónde entregan?</h2>
                <p>Solo en la Ciudad de México.</p>
                <h2 className="pt-2 text-xl font-semibold text-[var(--foreground)]">¿Cuánto cuesta el envío?</h2>
                <p>Es gratuito en compras superiores a $800 MXN. En compras menores se calcula según tu código postal.</p>
                <h2 className="pt-2 text-xl font-semibold text-[var(--foreground)]">¿Puedo recoger mi pedido?</h2>
                <p>Sí, en nuestra sucursal de Alfonso Reyes 234, Ciudad de México.</p>
                <h2 className="pt-2 text-xl font-semibold text-[var(--foreground)]">¿Cuál es el horario de la sucursal?</h2>
                <p>Lunes a viernes de 10:00 a 18:00 h y sábados de 10:00 a 17:00 h.</p>
                <h2 className="pt-2 text-xl font-semibold text-[var(--foreground)]">¿Cómo los contacto?</h2>
                <p>Por correo a <a href="mailto:contacto@schussler.com.mx" className="text-[var(--primary)] hover:underline">contacto@schussler.com.mx</a>.</p>
            </div>
        </div>
    )
}
