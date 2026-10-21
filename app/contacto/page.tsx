import type { Metadata } from "next"
import Link from "next/link"
import { WhatsAppButton } from "@/components/shop/whatsapp-button"
import { SocialLinks } from "@/components/shop/social-links"
import { HOURS_LINES } from "@/lib/store-hours"

export const metadata: Metadata = {
    title: "Contacto | Homeopáticos Schüssler",
    description: "Escríbenos a contacto@schussler.com.mx o visita nuestra sucursal en la Ciudad de México.",
}

export default function Page() {
    return (
        <div className="container-custom max-w-3xl py-10">
            <h1 className="text-3xl font-bold mb-6">Contacto</h1>
            <div className="space-y-4 text-[var(--muted-foreground)]">
                <p>Atendemos por correo electrónico y por WhatsApp:</p>
                <p>
                    <a href="mailto:contacto@schussler.com.mx" className="text-lg font-medium text-[var(--primary)] hover:underline">contacto@schussler.com.mx</a>
                </p>
                <p>
                    <WhatsAppButton message="Hola, tengo una consulta sobre Homeopáticos Schüssler.">Escríbenos por WhatsApp</WhatsAppButton>
                </p>
                <h2 className="pt-4 text-xl font-semibold text-[var(--foreground)]">Sucursal</h2>
                <p>Alfonso Reyes 234, Ciudad de México.</p>
                <h2 className="pt-4 text-xl font-semibold text-[var(--foreground)]">Horario de la sucursal</h2>
                <ul>
                    {HOURS_LINES.map((line) => (
                        <li key={line.days}>{line.days}: {line.hours}</li>
                    ))}
                </ul>
                <h2 className="pt-4 text-xl font-semibold text-[var(--foreground)]">Síguenos</h2>
                <SocialLinks className="text-[var(--primary)]" />
            </div>
        </div>
    )
}
