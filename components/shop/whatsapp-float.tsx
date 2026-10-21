import { MessageCircle } from "lucide-react"
import { whatsappEnabled, whatsappUrl } from "@/components/shop/whatsapp-button"

// Botón flotante global. Si no hay número configurado, no se muestra nada.
export function WhatsAppFloat() {
    if (!whatsappEnabled) return null
    return (
        <a
            href={whatsappUrl("Hola, tengo una consulta sobre Homeopáticos Schüssler.")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Escríbenos por WhatsApp (se abre en una pestaña nueva)"
            className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#128C7E] text-white shadow-lg transition-colors hover:bg-[#0e7064] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#128C7E] focus-visible:ring-offset-2"
        >
            <MessageCircle className="h-7 w-7" aria-hidden />
        </a>
    )
}
