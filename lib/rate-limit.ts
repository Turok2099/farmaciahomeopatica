import { headers } from "next/headers";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

// Limitador por ventana fija guardado en la base: en serverless no hay memoria compartida entre instancias.
// El upsert es atómico, así que las peticiones simultáneas no se saltan el límite.
export async function rateLimit(key: string, limit: number, windowSeconds: number) {
    const result = await db.execute(sql`
        INSERT INTO rate_limits (key, count, reset_at)
        VALUES (${key}, 1, now() + make_interval(secs => ${windowSeconds}))
        ON CONFLICT (key) DO UPDATE SET
            count = CASE WHEN rate_limits.reset_at <= now() THEN 1 ELSE rate_limits.count + 1 END,
            reset_at = CASE WHEN rate_limits.reset_at <= now() THEN EXCLUDED.reset_at ELSE rate_limits.reset_at END
        RETURNING count
    `);
    const count = Number((result.rows[0] as { count: number }).count);

    // Limpieza ocasional de contadores vencidos.
    if (Math.random() < 0.02) await db.execute(sql`DELETE FROM rate_limits WHERE reset_at < now()`);

    return count <= limit;
}

// IP del cliente. Vercel entrega la real como primer valor de x-forwarded-for.
export async function clientIp() {
    const h = await headers();
    return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "desconocida";
}

export const TOO_MANY_ATTEMPTS = "Demasiados intentos. Espera unos minutos e inténtalo de nuevo.";
