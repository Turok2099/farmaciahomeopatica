import { randomInt } from "node:crypto";

// Sin 0, 1, I, L ni O: se confunden al leerlos o dictarlos por WhatsApp. 31 símbolos × 6 posiciones ≈ 887 millones de códigos.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const LENGTH = 6;

export const ORDER_NUMBER_PREFIX = "SCH-";

// Código de pedido que ve el cliente, p. ej. SCH-7K4M9Q. No es consecutivo: no revela cuántos pedidos hay.
// La columna es única; si dos pedidos obtuvieran el mismo código, la base rechaza el segundo y se genera otro.
export function generateOrderNumber() {
    let code = "";
    for (let i = 0; i < LENGTH; i++) code += ALPHABET[randomInt(ALPHABET.length)];
    return ORDER_NUMBER_PREFIX + code;
}

// ¿El error es una violación de unicidad de Postgres (23505)? Drizzle envuelve el error original en `cause`.
export function isUniqueViolation(error: unknown): boolean {
    for (let e = error as { code?: string; cause?: unknown } | undefined, depth = 0; e && depth < 4; e = e.cause as typeof e, depth++) {
        if (e.code === "23505") return true;
    }
    return false;
}
