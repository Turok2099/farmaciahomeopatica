import { config } from "dotenv";
config({ path: ".env.local", quiet: true });

const FEATURED = ["sales-de-schussler", "kit-schussler-fit", "botiquin-viaje", "gel-arnica"];

const slugify = (value: string) =>
    value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function main() {
    const { db } = await import("../lib/db");
    const { categories, products } = await import("../lib/schema");
    const { eq } = await import("drizzle-orm");
    const { seedProducts } = await import("./seed-data");

    const names = [...new Set(seedProducts.map((p) => p.category))];
    await db.insert(categories).values(names.map((name) => ({ name, slug: slugify(name) }))).onConflictDoNothing();
    const cats = await db.select().from(categories);
    const byName = new Map(cats.map((c) => [c.name, c.id]));

    await db.insert(products).values(
        seedProducts.map((p) => ({
            name: p.name,
            slug: p.slug,
            priceCents: Math.round(p.price * 100),
            categoryId: byName.get(p.category)!,
            imageId: p.imageId,
            featured: FEATURED.includes(p.slug),
        }))
    ).onConflictDoNothing({ target: products.slug });

    const total = await db.select({ id: products.id }).from(products).where(eq(products.published, true));
    console.log(`Categorías: ${cats.length}. Productos publicados en la base: ${total.length}.`);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
