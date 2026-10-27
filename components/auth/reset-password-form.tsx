'use client'

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Honeypot } from "@/components/auth/honeypot"
import { resetPassword } from "@/app/actions/auth"

const inputClass =
    "appearance-none rounded-md relative block w-full px-3 py-2 border border-[var(--border)] placeholder-gray-500 text-[var(--foreground)] focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm"

export function ResetPasswordForm({ token }: { token: string }) {
    const [state, action, isPending] = useActionState(resetPassword, undefined)

    return (
        <form className="space-y-4" action={action}>
            <Honeypot />
            <input type="hidden" name="token" value={token} />
            <div>
                <label htmlFor="password" className="sr-only">Nueva contraseña</label>
                <input id="password" name="password" type="password" autoComplete="new-password" required minLength={6} maxLength={72} className={inputClass} placeholder="Nueva contraseña (mínimo 6 caracteres)" />
                {state?.errors?.password && <p className="text-red-500 text-xs mt-1">{state.errors.password[0]}</p>}
            </div>
            <div>
                <label htmlFor="confirm" className="sr-only">Confirma la contraseña</label>
                <input id="confirm" name="confirm" type="password" autoComplete="new-password" required className={inputClass} placeholder="Confirma la contraseña" />
                {state?.errors?.confirm && <p className="text-red-500 text-xs mt-1">{state.errors.confirm[0]}</p>}
            </div>
            {state?.message && <p role="alert" className="text-red-500 text-sm text-center">{state.message}</p>}
            <Button className="w-full" disabled={isPending}>
                {isPending ? "Guardando..." : "Guardar contraseña"}
            </Button>
        </form>
    )
}
