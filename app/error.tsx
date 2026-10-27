'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    console.error(error)

    return (
        <div className="container-custom flex flex-col items-center py-24 text-center" role="alert">
            <h1 className="mb-2 text-3xl font-bold">Algo salió mal</h1>
            <p className="mb-8 max-w-md text-[var(--muted-foreground)]">
                No pudimos cargar esta página. Inténtalo de nuevo; si el problema continúa, escríbenos por WhatsApp desde la página de contacto.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
                <Button onClick={reset}>Reintentar</Button>
                <Link href="/">
                    <Button variant="outline">Ir al inicio</Button>
                </Link>
            </div>
            {error.digest && <p className="mt-8 text-xs text-[var(--muted-foreground)]">Código: {error.digest}</p>}
        </div>
    )
}
