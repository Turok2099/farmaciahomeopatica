
'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Honeypot } from "@/components/auth/honeypot"
import { useActionState } from "react"
import { login } from "@/app/actions/auth"

export default function LoginPage() {
    const [state, action, isPending] = useActionState(login, undefined)

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-10 px-4">
            <div className="w-full max-w-md space-y-8 bg-[var(--card)] p-8 rounded-xl shadow-lg border border-[var(--border)]">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--foreground)]">
                        Bienvenido de nuevo
                    </h2>
                    <p className="mt-2 text-center text-sm text-[var(--muted-foreground)]">
                        Accede a tu cuenta para gestionar tus pedidos
                    </p>
                </div>
                <form className="mt-8 space-y-6" action={action}>
                    <Honeypot />
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label htmlFor="email-address" className="sr-only">Correo electrónico</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-[var(--border)] placeholder-gray-500 text-[var(--foreground)] focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] focus:z-10 sm:text-sm"
                                placeholder="Correo electrónico"
                            />
                            {state?.errors?.email && <p className="text-red-500 text-xs mt-1">{state.errors.email}</p>}
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Contraseña</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-[var(--border)] placeholder-gray-500 text-[var(--foreground)] focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] focus:z-10 sm:text-sm"
                                placeholder="Contraseña"
                            />
                            {state?.errors?.password && <p className="text-red-500 text-xs mt-1">{state.errors.password}</p>}
                        </div>
                    </div>

                    {state?.message && (
                        <p className="text-red-500 text-sm text-center">{state.message}</p>
                    )}

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-[var(--primary)] focus:ring-[var(--primary)] border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-[var(--muted-foreground)]">
                                Recordarme
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link href="/auth/olvide" className="font-medium text-[var(--primary)] hover:text-[var(--primary)]/80">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>
                    </div>

                    <div>
                        <Button className="w-full" disabled={isPending}>
                            {isPending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </Button>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <p className="text-sm text-[var(--muted-foreground)]">
                        ¿No tienes cuenta? <Link href="/auth/registro" className="text-[var(--primary)] hover:underline">Regístrate</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
