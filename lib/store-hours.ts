// Horario de la sucursal (hora de Ciudad de México). Única fuente para textos y para el aviso de entrega.
export const TIME_ZONE = "America/Mexico_City"

// Índice = día de la semana (0 = domingo). Minutos desde las 00:00; null = cerrado.
const SCHEDULE: ({ open: number; close: number } | null)[] = [
    null,
    { open: 600, close: 1080 },
    { open: 600, close: 1080 },
    { open: 600, close: 1080 },
    { open: 600, close: 1080 },
    { open: 600, close: 1080 },
    { open: 600, close: 1020 },
]

export const HOURS_LINES = [
    { days: "Lunes a viernes", hours: "10:00 a 18:00 h" },
    { days: "Sábados", hours: "10:00 a 17:00 h" },
]

// "Llega hoy" solo si faltan al menos 2 horas para el cierre.
const CUTOFF_BEFORE_CLOSE = 120

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export type DeliveryPromise =
    | { kind: "today"; minutesLeft: number }
    | { kind: "next"; label: "mañana" | "el lunes" }

export function getDeliveryPromise(now: Date = new Date()): DeliveryPromise {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: TIME_ZONE, weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23",
    }).formatToParts(now)
    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ""
    const day = DAYS.indexOf(get("weekday"))
    const minutes = Number(get("hour")) * 60 + Number(get("minute"))

    const today = SCHEDULE[day]
    if (today) {
        const left = today.close - CUTOFF_BEFORE_CLOSE - minutes
        if (left > 0) return { kind: "today", minutesLeft: left }
    }
    // Siguiente día hábil: si mañana la sucursal está cerrada (domingo), es el lunes.
    return { kind: "next", label: SCHEDULE[(day + 1) % 7] ? "mañana" : "el lunes" }
}
