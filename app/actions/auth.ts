
'use server'

import { hash, compare } from 'bcryptjs'
import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { createSession, deleteSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { z } from "zod"

const SignupSchema = z.object({
    name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
    email: z.string().trim().toLowerCase().pipe(z.email({ message: "Ingrese un correo electrónico válido." })),
    password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
});

const LoginSchema = z.object({
    email: z.string().trim().toLowerCase().pipe(z.email()),
    password: z.string().min(1),
});

export type FormState = {
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
    };
    message?: string;
} | undefined;

export async function signup(prevState: FormState, formData: FormData): Promise<FormState> {
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
