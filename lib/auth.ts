import { cache } from "react";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, type UserRole } from "@/lib/schema";
import { getSession } from "@/lib/session";

// El rol se lee de la base en cada petición: quitar un permiso surte efecto de inmediato.
export const getCurrentUser = cache(async () => {
    const session = await getSession();
    const userId = Number(session?.userId);
    if (!userId) return null;
    const [user] = await db
        .select({ id: users.id, name: users.name, email: users.email, role: users.role })
        .from(users)
        .where(eq(users.id, userId));
    return user ?? null;
});

// Úsalo en cada página y acción del panel: no basta con ocultar enlaces.
export async function requireRole(...allowed: UserRole[]) {
    const user = await getCurrentUser();
    if (!user) redirect("/auth/login");
    if (!allowed.includes(user.role)) redirect("/");
    return user;
}
