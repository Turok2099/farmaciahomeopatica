
'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useActionState } from "react"
import { signup } from "@/app/actions/auth"

export default function RegisterPage() {
    const [state, action, isPending] = useActionState(signup, undefined)

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-10 px-4">
            <div className="w-full max-w-md space-y-8 bg-[var(--card)] p-8 rounded-xl shadow-lg border border-[var(--border)]">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--foreground)]">
                        Crear una cuenta
                    </h2>
                    <p className="mt-2 text-center text-sm text-[var(--muted-foreground)]">
                        Únete a Homeopáticos Schüssler y empieza tu camino hacia lo natural
                    </p>
                </div>
                <form className="mt-8 space-y-6" action={action}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="name" className="sr-only">Nombre completo</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-[var(--border)] placeholder-gray-500 text-[var(--foreground)] focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] focus:z-10 sm:text-sm"
                                placeholder="Nombre completo"
                            />
                            {state?.errors?.name && <p className="text-red-500 text-xs mt-1">{state.errors.name}</p>}
                        </div>
                        <div>
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
                                autoComplete="new-password"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-[var(--border)] placeholder-gray-500 text-[var(--foreground)] focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] focus:z-10 sm:text-sm"
                                placeholder="Contraseña"
                            />
                            {state?.errors?.password && (
                                <div className="text-red-500 text-xs mt-1">
                                    <ul>
                                        {state.errors.password.map((error: string) => (
                                            <li key={error}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {state?.message && (
                        <p className="text-red-500 text-sm text-center">{state.message}</p>
                    )}

                    <div>
                        <Button className="w-full" disabled={isPending}>
                            {isPending ? 'Registrando...' : 'Registrarse'}
                        </Button>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <p className="text-sm text-[var(--muted-foreground)]">
                        ¿Ya tienes cuenta? <Link href="/auth/login" className="text-[var(--primary)] hover:underline">Inicia Sesión</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
