import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Preguntas frecuentes | Homeopáticos Schüssler",
    description: "Respuestas sobre entregas, horarios y contacto de Homeopáticos Schüssler.",
}

export default function Page() {
    return (
        <div className="container-custom max-w-3xl py-10">
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
