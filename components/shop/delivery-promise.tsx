'use client'

import { useEffect, useState } from "react"
import { TruckIcon } from "@heroicons/react/24/outline"
import { getDeliveryPromise, type DeliveryPromise as Promise_ } from "@/lib/store-hours"

function formatLeft(minutes: number) {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return h > 0 ? `${h} h ${m} min` : `${m} min`
}

// Aviso estilo "Llega hoy". Se calcula en el navegador con la hora de CDMX; el alto se reserva para evitar saltos.
export function DeliveryPromise({ className = "" }: { className?: string }) {
    const [promise, setPromise] = useState<Promise_ | null>(null)

    useEffect(() => {
        const update = () => setPromise(getDeliveryPromise())
        update()
        const timer = setInterval(update, 60_000)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className={`flex min-h-[3.25rem] items-center gap-3 rounded-lg border border-[#b7e0cb] bg-[#eef8f2] px-4 py-3 text-[#14452f] ${className}`}>
            <TruckIcon className="h-6 w-6 shrink-0" />
            {promise && (
                <p className="text-sm">
                    <span className="font-semibold">Llega {promise.kind === "today" ? "hoy" : promise.label}</span>
                    {promise.kind === "today"
                        ? <> · pídelo en las próximas {formatLeft(promise.minutesLeft)}</>
                        : <> · pídelo ahora</>}
                </p>
            )}
        </div>
    )
}
