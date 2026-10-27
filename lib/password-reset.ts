import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/lib/db";
import { passwordResetTokens, users } from "@/lib/schema";
import { sendEmail } from "@/lib/email";
import { CONTACT_EMAIL, emailButton, emailLayout, emailStyles as s, esc } from "@/lib/email-layout";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hora

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

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

export function renderPasswordReset(user: { name: string }, url: string) {
    const body = `
<h1 style="${s.h1}">Restablece tu contraseña</h1>
<p style="${s.p}">Hola, ${esc(user.name)}. Recibimos una solicitud para cambiar la contraseña de tu cuenta. Pulsa el botón para crear una nueva.</p>
${emailButton(url, "Crear nueva contraseña")}
<p style="${s.small}">Si el botón no funciona, copia y pega este enlace en tu navegador:<br><a href="${url}" style="color:${s.colors.brand};word-break:break-all">${url}</a></p>
<div style="${s.box}">
  <p style="margin:0;font-size:14px;line-height:1.5;color:${s.colors.text}">El enlace vence en <strong>1 hora</strong> y solo se puede usar una vez. Si tú no lo pediste, ignora este correo: tu contraseña no cambiará.</p>
</div>`;

    return {
        subject: `Restablece tu contraseña | ${SITE_NAME}`,
        html: emailLayout({ preheader: "Crea una nueva contraseña para tu cuenta. El enlace vence en 1 hora.", body }),
        text: `Hola, ${user.name}. Para crear una nueva contraseña abre este enlace (vence en 1 hora y solo sirve una vez): ${url}\nSi no lo pediste, ignora este correo.`,
    };
}

export async function sendPasswordResetEmail(user: { id: number; name: string; email: string }) {
    const token = await createResetToken(user.id);
    const url = `${SITE_URL}/auth/restablecer?token=${token}`;

    await sendEmail({ to: user.email, replyTo: CONTACT_EMAIL, ...renderPasswordReset(user, url) });
}
