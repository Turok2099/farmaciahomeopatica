import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/lib/db";
import { passwordResetTokens, users } from "@/lib/schema";
import { sendEmail } from "@/lib/email";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hora

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");
const esc = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Un solo enlace vigente por usuario: al pedir uno nuevo se invalidan los anteriores.
async function createResetToken(userId: number) {
    const token = randomBytes(32).toString("hex");
    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, userId));
    await db.insert(passwordResetTokens).values({
        userId,
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
    });
    return token;
}

// Devuelve el id del usuario dueño del token si sigue vigente.
export async function findUserByResetToken(token: string) {
    if (!/^[a-f0-9]{64}$/.test(token)) return null;
    const [row] = await db
        .select({ userId: passwordResetTokens.userId })
        .from(passwordResetTokens)
        .where(and(eq(passwordResetTokens.tokenHash, hashToken(token)), gt(passwordResetTokens.expiresAt, new Date())));
    return row ? row.userId : null;
}

// Cada token sirve una sola vez: al cambiar la contraseña se borran todos los del usuario.
export async function consumeResetTokens(userId: number) {
    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, userId));
}

export async function findUserByEmail(email: string) {
    const [user] = await db.select({ id: users.id, name: users.name, email: users.email }).from(users).where(eq(users.email, email));
    return user ?? null;
}

export async function sendPasswordResetEmail(user: { id: number; name: string; email: string }) {
    const token = await createResetToken(user.id);
    const url = `${SITE_URL}/auth/restablecer?token=${token}`;

    await sendEmail({
        to: user.email,
        subject: `Restablece tu contraseña | ${SITE_NAME}`,
        replyTo: "contacto@schussler.com.mx",
        html: `<div style="font-family:system-ui,Arial,sans-serif;max-width:560px;margin:0 auto;color:#172b3a">
<h1 style="font-size:22px">Restablece tu contraseña</h1>
<p>Hola, ${esc(user.name)}. Recibimos una solicitud para cambiar la contraseña de tu cuenta.</p>
<p><a href="${url}" style="display:inline-block;background:#014c80;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none">Crear nueva contraseña</a></p>
<p style="color:#5b6b78;font-size:14px">El enlace vence en 1 hora y solo se puede usar una vez. Si tú no lo pediste, ignora este correo: tu contraseña no cambiará.</p>
</div>`,
        text: `Hola, ${user.name}. Para crear una nueva contraseña abre este enlace (vence en 1 hora): ${url}\nSi no lo pediste, ignora este correo.`,
    });
}
