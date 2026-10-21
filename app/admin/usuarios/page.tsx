import { asc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import { requireRole } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { NewStaffForm } from "@/components/admin/simple-forms"
import { deleteStaff } from "@/app/admin/actions"

export default async function AdminUsers() {
    await requireRole("admin")
    const staff = await db
        .select({ id: users.id, name: users.name, email: users.email })
        .from(users)
        .where(eq(users.role, "staff"))
        .orderBy(asc(users.name))

    return (
        <div className="max-w-2xl">
            <h1 className="mb-2 text-2xl font-semibold">Usuarios del panel</h1>
            <p className="mb-6 text-sm text-[var(--muted-foreground)]">
                Los colaboradores solo pueden activar o desactivar la disponibilidad de los productos.
            </p>

            <h2 className="mb-3 font-semibold">Nuevo colaborador</h2>
            <div className="mb-10"><NewStaffForm /></div>

            <h2 className="mb-3 font-semibold">Colaboradores ({staff.length})</h2>
            {staff.length === 0 ? (
                <p className="text-sm text-[var(--muted-foreground)]">Aún no hay colaboradores.</p>
            ) : (
                <ul className="divide-y divide-[var(--border)] rounded-lg border border-[var(--border)]">
                    {staff.map((member) => (
                        <li key={member.id} className="flex items-center justify-between gap-3 p-3">
                            <div>
                                <p className="font-medium">{member.name}</p>
                                <p className="text-sm text-[var(--muted-foreground)]">{member.email}</p>
                            </div>
                            <form action={deleteStaff}>
                                <input type="hidden" name="id" value={member.id} />
                                <Button size="sm" variant="outline" className="text-red-600">Eliminar</Button>
                            </form>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
