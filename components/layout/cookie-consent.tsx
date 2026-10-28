"use client"

import { useSyncExternalStore } from "react"
import Link from "next/link"
import Script from "next/script"
import { GA_ID } from "@/lib/site"

const KEY = "cookie-consent"
const EVENT = "cookie-consent-change"
type Choice = "accepted" | "rejected" | null

function read(): Choice {
    try {
        const v = localStorage.getItem(KEY)
        return v === "accepted" || v === "rejected" ? v : null
    } catch {
        return null
    }
}

function subscribe(cb: () => void) {
    window.addEventListener(EVENT, cb)
    window.addEventListener("storage", cb)
    return () => {
        window.removeEventListener(EVENT, cb)
        window.removeEventListener("storage", cb)
    }
}

function save(choice: Exclude<Choice, null> | "reset") {
    try {
        if (choice === "reset") localStorage.removeItem(KEY)
        else localStorage.setItem(KEY, choice)
    } catch {}
    window.dispatchEvent(new Event(EVENT))
}

// Google Analytics solo se carga si el visitante lo acepta. Sin decisión (o al rechazar) no se instala nada.
export function CookieConsent() {
    // En el servidor se asume "rejected" para no pintar el aviso ni cargar GA antes de hidratar.
    const choice = useSyncExternalStore(subscribe, read, () => "rejected" as Choice)

    return (
        <>
            {choice === "accepted" && (
                <>
                    <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
                    <Script id="ga4" strategy="afterInteractive">
                        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
                    </Script>
                </>
            )}
            {choice === null && (
                <div
                    role="dialog"
                    aria-label="Aviso de cookies"
                    className="fixed inset-x-0 bottom-0 z-[60] border-t border-[var(--border)] bg-[var(--background)] p-4 shadow-lg"
                >
                    <div className="container-custom flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-[var(--muted-foreground)]">
                            Usamos cookies necesarias para que la tienda funcione y, solo si lo aceptas, cookies de analítica (Google Analytics) para saber cómo se usa el sitio y mejorarlo.{" "}
                            <Link href="/privacidad#cookies" className="text-[var(--primary)] underline underline-offset-4">Más información</Link>
                        </p>
                        <div className="flex shrink-0 gap-2">
                            <button
                                type="button"
                                onClick={() => save("rejected")}
                                className="h-10 rounded-md border border-[var(--border)] px-4 text-sm font-medium hover:bg-[var(--muted)] focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
                            >
                                Rechazar
                            </button>
                            <button
                                type="button"
                                onClick={() => save("accepted")}
                                className="h-10 rounded-md bg-[var(--primary)] px-4 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90 focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

// Enlace del pie para volver a decidir.
export function CookiePreferencesButton({ className }: { className?: string }) {
    return (
        <button type="button" onClick={() => save("reset")} className={className}>
            Preferencias de cookies
        </button>
    )
}
