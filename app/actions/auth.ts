
'use server'

import { hash, compare } from 'bcryptjs'
import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { createSession, deleteSession } from "@/lib/session"
import { clientIp, rateLimit, TOO_MANY_ATTEMPTS } from "@/lib/rate-limit"
import { consumeResetTokens, findUserByEmail, findUserByResetToken, sendPasswordResetEmail } from "@/lib/password-reset"
import { redirect } from "next/navigation"
import { z } from "zod"

// bcrypt solo usa los primeros 72 bytes: más largo no aporta seguridad.
const PasswordSchema = z.string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres." })
    .max(72, { message: "La contraseña es demasiado larga." });

const SignupSchema = z.object({
    name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
    email: z.string().trim().toLowerCase().pipe(z.email({ message: "Ingrese un correo electrónico válido." })),
    password: PasswordSchema,
});

const EmailSchema = z.object({
    email: z.string().trim().toLowerCase().pipe(z.email({ message: "Ingrese un correo electrónico válido." })),
});

const ResetSchema = z.object({
    token: z.string(),
    password: PasswordSchema,
    confirm: z.string(),
}).refine((d) => d.password === d.confirm, { message: "Las contraseñas no coinciden.", path: ["confirm"] });

// Los bots llenan el campo trampa "hp_contacto" (ver components/auth/honeypot.tsx).
const isBot = (formData: FormData) => Boolean(formData.get('hp_contacto'));

const LoginSchema = z.object({
    email: z.string().trim().toLowerCase().pipe(z.email()),
    password: z.string().min(1),
});

export type FormState = {
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        confirm?: string[];
    };
    message?: string;
    ok?: boolean;
} | undefined;

export async function signup(prevState: FormState, formData: FormData): Promise<FormState> {
    if (isBot(formData)) return { message: "No se pudo completar el registro." }
    if (!(await rateLimit(`signup:ip:${await clientIp()}`, 5, 60 * 60))) return { message: TOO_MANY_ATTEMPTS }

    const validatedFields = SignupSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { name, email, password } = validatedFields.data

    try {
        const existingUser = await db.select().from(users).where(eq(users.email, email))
        if (existingUser.length > 0) {
            return {
                errors: {
                    email: ["El correo electrónico ya está registrado."],
                },
            }
        }

        const hashedPassword = await hash(password, 10)
        const [user] = await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
        }).returning()

        await createSession(user.id.toString())
    } catch (error) {
        return {
            message: "Error de base de datos: error al crear usuario.",
        }
    }

    redirect('/dashboard')
}

export async function login(prevState: FormState, formData: FormData): Promise<FormState> {
    if (isBot(formData)) return { message: "Credenciales inválidas." }
    if (!(await rateLimit(`login:ip:${await clientIp()}`, 20, 15 * 60))) return { message: TOO_MANY_ATTEMPTS }

    const validatedFields = LoginSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { email, password } = validatedFields.data

    // Límite por cuenta: frena la adivinanza de contraseñas aunque cambien de IP.
    if (!(await rateLimit(`login:email:${email}`, 8, 15 * 60))) return { message: TOO_MANY_ATTEMPTS }

    try {
        const [user] = await db.select().from(users).where(eq(users.email, email))

        if (!user || !(await compare(password, user.password))) {
            return {
                message: "Credenciales inválidas.",
            }
        }

        await createSession(user.id.toString())
    } catch (error) {
        return {
            message: "Ocurrió un error inesperado.",
        }
    }

    redirect('/dashboard')
}

export async function logout() {
    await deleteSession()
    redirect('/auth/login')
}

export async function requestPasswordReset(prevState: FormState, formData: FormData): Promise<FormState> {
    // Misma respuesta exista o no la cuenta, para no revelar qué correos están registrados.
    const generic: FormState = {
        ok: true,
        message: "Si el correo está registrado, te enviamos un enlace para crear una nueva contraseña. Revisa también tu carpeta de spam.",
    }
    if (isBot(formData)) return generic

    const parsed = EmailSchema.safeParse({ email: formData.get('email') })
    if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors }
    const { email } = parsed.data

    if (!(await rateLimit(`reset:ip:${await clientIp()}`, 5, 60 * 60))) return { message: TOO_MANY_ATTEMPTS }
    if (!(await rateLimit(`reset:email:${email}`, 3, 60 * 60))) return generic

    try {
        const user = await findUserByEmail(email)
        if (user) await sendPasswordResetEmail(user)
    } catch (error) {
        console.error("Recuperar contraseña: no se pudo enviar el correo", error instanceof Error ? error.message : error)
    }
    return generic
}

export async function resetPassword(prevState: FormState, formData: FormData): Promise<FormState> {
    if (isBot(formData)) return { message: "No se pudo cambiar la contraseña." }
    if (!(await rateLimit(`reset-submit:ip:${await clientIp()}`, 10, 60 * 60))) return { message: TOO_MANY_ATTEMPTS }

    const parsed = ResetSchema.safeParse({
        token: formData.get('token'),
        password: formData.get('password'),
        confirm: formData.get('confirm'),
    })
    if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors }
    const { token, password } = parsed.data

    const userId = await findUserByResetToken(token)
    if (!userId) return { message: "El enlace no es válido o ya venció. Solicita uno nuevo." }

    try {
        await db.update(users).set({ password: await hash(password, 10) }).where(eq(users.id, userId))
        await consumeResetTokens(userId)
        await createSession(userId.toString())
    } catch (error) {
        console.error("Restablecer contraseña: error", error instanceof Error ? error.message : error)
        return { message: "Ocurrió un error inesperado. Inténtalo de nuevo." }
    }

    redirect('/dashboard')
}
