import type { Metadata } from "next"
import Link from "next/link"
import { findUserByResetToken } from "@/lib/password-reset"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export const metadata: Metadata = {
    title: "Nueva contraseña",
    // El token viaja en la URL: que no se filtre por el encabezado Referer.
    referrer: "no-referrer",
}

export default async function ResetPasswordPage(props: { searchParams: Promise<{ token?: string }> }) {
    const { token = "" } = await props.searchParams
    const valid = (await findUserByResetToken(token)) !== null

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-10 px-4">
            <div className="w-full max-w-md space-y-6 bg-[var(--card)] p-8 rounded-xl shadow-lg border border-[var(--border)]">
                {valid ? (
                    <>
                        <div>
                            <h1 className="text-center text-3xl font-extrabold text-[var(--foreground)]">Crea tu nueva contraseña</h1>
                            <p className="mt-2 text-center text-sm text-[var(--muted-foreground)]">Al guardarla iniciarás sesión automáticamente.</p>
                        </div>
                        <ResetPasswordForm token={token} />
                    </>
                ) : (
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">Enlace no válido</h1>
                        <p className="mt-2 text-sm text-[var(--muted-foreground)]">Este enlace ya se usó o venció. Solicita uno nuevo.</p>
                        <Link href="/auth/olvide" className="mt-6 inline-block text-[var(--primary)] hover:underline">Recuperar contraseña</Link>
                    </div>
                )}
            </div>
        </div>
    )
}
