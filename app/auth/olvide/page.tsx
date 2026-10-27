'use client'

import Link from "next/link"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Honeypot } from "@/components/auth/honeypot"
import { requestPasswordReset } from "@/app/actions/auth"

export default function ForgotPasswordPage() {
    const [state, action, isPending] = useActionState(requestPasswordReset, undefined)

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-10 px-4">
            <div className="w-full max-w-md space-y-6 bg-[var(--card)] p-8 rounded-xl shadow-lg border border-[var(--border)]">
                <div>
                    <h1 className="text-center text-3xl font-extrabold text-[var(--foreground)]">Recupera tu contraseña</h1>
                    <p className="mt-2 text-center text-sm text-[var(--muted-foreground)]">
                        Escribe el correo de tu cuenta y te enviaremos un enlace para crear una nueva contraseña.
                    </p>
                </div>

                {state?.ok ? (
                    <p role="status" className="rounded-md border border-[var(--border)] bg-[var(--muted)] p-4 text-sm">{state.message}</p>
                ) : (
                    <form className="space-y-6" action={action}>
                        <Honeypot />
                        <div>
                            <label htmlFor="email" className="sr-only">Correo electrónico</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-[var(--border)] placeholder-gray-500 text-[var(--foreground)] focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm"
                                placeholder="Correo electrónico"
                            />
                            {state?.errors?.email && <p className="text-red-500 text-xs mt-1">{state.errors.email}</p>}
                        </div>
                        {state?.message && <p role="alert" className="text-red-500 text-sm text-center">{state.message}</p>}
                        <Button className="w-full" disabled={isPending}>
                            {isPending ? "Enviando..." : "Enviar enlace"}
                        </Button>
                    </form>
                )}

                <p className="text-center text-sm text-[var(--muted-foreground)]">
                    <Link href="/auth/login" className="text-[var(--primary)] hover:underline">Volver a iniciar sesión</Link>
                </p>
            </div>
        </div>
    )
}
