import { config } from "dotenv";
config({ path: ".env.local", quiet: true });

// Uso: npm run make-admin -- correo@dominio.com   (la cuenta debe estar registrada)
async function main() {
    const email = process.argv[2]?.trim().toLowerCase();
    if (!email) throw new Error("Indica el correo: npm run make-admin -- correo@dominio.com");

    const { db } = await import("../lib/db");
    const { users } = await import("../lib/schema");
    const { eq, ne, and, sql } = await import("drizzle-orm");

    const [user] = await db.select().from(users).where(sql`lower(${users.email}) = ${email}`);
    if (!user) throw new Error("No hay una cuenta registrada con ese correo. Regístrate primero en /auth/registro.");

    // Administrador único: cualquier otro admin pasa a cliente.
    await db.update(users).set({ role: "customer" }).where(and(eq(users.role, "admin"), ne(users.id, user.id)));
    await db.update(users).set({ role: "admin" }).where(eq(users.id, user.id));
    console.log(`${user.email} es ahora el administrador único.`);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
