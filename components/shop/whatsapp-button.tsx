import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline"
import { cn } from "@/lib/utils"

// Número en formato internacional, solo dígitos: 5215512345678. Se define en .env.local.
const NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "")

export const whatsappEnabled = NUMBER.length >= 10

export function whatsappUrl(message: string) {
    return `https://wa.me/${NUMBER}?text=${encodeURIComponent(message)}`
}

// Si no hay número configurado, no se muestra nada.
export function WhatsAppButton({
    message,
    children,
    className,
}: {
    message: string
    children: React.ReactNode
    className?: string
}) {
    if (!whatsappEnabled) return null
    return (
        <a
            href={whatsappUrl(message)}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#128C7E] px-4 text-sm font-medium text-white transition-colors hover:bg-[#0e7064] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#128C7E] focus-visible:ring-offset-2",
                className
            )}
        >
            <ChatBubbleLeftEllipsisIcon className="h-4 w-4" aria-hidden />
            {children}
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
        </a>
    )
}
