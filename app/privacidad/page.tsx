import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Aviso de privacidad | Homeopáticos Schüssler",
    description: "Aviso de privacidad de Homeopáticos Schüssler.",
}

export default function Page() {
    return (
        <div className="container-custom max-w-3xl py-10">
            <h1 className="text-3xl font-bold mb-6">Aviso de privacidad</h1>
            <div className="space-y-4 text-[var(--muted-foreground)]">
                <p>Estamos preparando el aviso de privacidad completo. Mientras tanto, para cualquier duda sobre tus datos escríbenos a{" "}
                    <a href="mailto:contacto@schussler.com.mx" className="text-[var(--primary)] hover:underline">contacto@schussler.com.mx</a>.
                </p>
            </div>
        </div>
    )
}
