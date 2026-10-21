
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { logout } from "@/app/actions/auth"
import { getCurrentUser } from "@/lib/auth"

export default async function DashboardPage() {
    const user = await getCurrentUser()
    const canManage = user?.role === "admin" || user?.role === "staff"

    return (
        <div className="container-custom py-10">
            <h1 className="text-3xl font-bold mb-4">Mi Cuenta</h1>
            <p className="mb-8">Bienvenido a tu panel de control.</p>

            <div className="bg-[var(--card)] p-6 rounded-lg border border-[var(--border)]">
                <h2 className="text-xl font-semibold mb-4">Información</h2>
                <p className="text-[var(--muted-foreground)] mb-6">Desde aquí puedes ver tus pedidos recientes y gestionar tus direcciones.</p>

                {canManage && (
                    <p className="mb-6">
                        <Link href="/admin/productos" className="font-medium text-[var(--primary)] hover:underline">Ir al panel de administración</Link>
                    </p>
                )}

                <form action={logout}>
                    <Button variant="outline">Cerrar Sesión</Button>
                </form>
            </div>
        </div>
    )
}
