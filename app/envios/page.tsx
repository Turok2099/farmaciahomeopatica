import type { Metadata } from "next"
import { WhatsAppButton } from "@/components/shop/whatsapp-button"

export const metadata: Metadata = {
    title: "Envíos y entrega",
    alternates: { canonical: "/envios" },
    description: "Entrega a domicilio en CDMX, envío gratis en compras superiores a $800 MXN o recoge en sucursal.",
}

export default function Page() {
    return (
        <div className="container-custom max-w-3xl py-10">
            <h1 className="text-3xl font-bold mb-6">Envíos y entrega</h1>
            <div className="space-y-4 text-[var(--muted-foreground)]">
                <p>Solo realizamos entregas dentro de la Ciudad de México.</p>
                <h2 className="pt-4 text-xl font-semibold text-[var(--foreground)]">Entrega a domicilio</h2>
                <ul className="list-disc space-y-2 pl-6">
                    <li>Envío gratuito en compras superiores a $800 MXN.</li>
                    <li>En compras menores, te confirmamos el costo del envío según tu código postal. Consúltalo por WhatsApp.</li>
                </ul>
                <p>
                    <WhatsAppButton message="Hola, quiero cotizar el envío a domicilio de mi pedido. Mi código postal es: ">Cotizar envío por WhatsApp</WhatsAppButton>
                </p>
                <h2 className="pt-4 text-xl font-semibold text-[var(--foreground)]">Recoger en sucursal</h2>
                <p>Puedes recoger tu pedido sin costo de envío en Alfonso Reyes 234, Ciudad de México.</p>
            </div>
        </div>
    )
}
