import { and, asc, count, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories, products as productsTable } from "@/lib/schema";
import { imageUrl } from "@/lib/cloudinary";

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    presentation: string;
    price: number; // MXN
    category: string;
    image: string;
    available: boolean;
    featured: boolean;
}

const columns = {
    id: productsTable.id,
    name: productsTable.name,
    slug: productsTable.slug,
    description: productsTable.description,
    presentation: productsTable.presentation,
    priceCents: productsTable.priceCents,
    category: categories.name,
    imageId: productsTable.imageId,
    available: productsTable.available,
    featured: productsTable.featured,
};

type Row = {
    id: number; name: string; slug: string; description: string; presentation: string;
    priceCents: number; category: string; imageId: string; available: boolean; featured: boolean;
};

const toProduct = (row: Row): Product => ({
    id: String(row.id),
    name: row.name,
    slug: row.slug,
    description: row.description,
    presentation: row.presentation,
    price: row.priceCents / 100,
    category: row.category,
    image: imageUrl(row.imageId),
    available: row.available,
    featured: row.featured,
});

// Solo productos publicados (tienda pública).
export async function getProducts(): Promise<Product[]> {
    const rows = await db
        .select(columns)
        .from(productsTable)
        .innerJoin(categories, eq(productsTable.categoryId, categories.id))
        .where(eq(productsTable.published, true))
        .orderBy(asc(productsTable.name));
    return rows.map(toProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
    const rows = await db
        .select(columns)
        .from(productsTable)
        .innerJoin(categories, eq(productsTable.categoryId, categories.id))
        .where(and(eq(productsTable.published, true), eq(productsTable.featured, true)))
        .orderBy(asc(productsTable.name))
        .limit(8);
    return rows.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    const [row] = await db
        .select(columns)
        .from(productsTable)
        .innerJoin(categories, eq(productsTable.categoryId, categories.id))
        .where(and(eq(productsTable.slug, slug), eq(productsTable.published, true)));
    return row ? toProduct(row) : null;
}

export async function getProductsByIds(ids: number[]): Promise<Product[]> {
    if (ids.length === 0) return [];
    const rows = await db
        .select(columns)
        .from(productsTable)
        .innerJoin(categories, eq(productsTable.categoryId, categories.id))
        .where(and(inArray(productsTable.id, ids), eq(productsTable.published, true)));
    return rows.map(toProduct);
}

// Solo categorías con al menos un producto publicado.
export async function getStoreCategories(): Promise<string[]> {
    const rows = await db
        .selectDistinct({ name: categories.name })
        .from(categories)
        .innerJoin(productsTable, eq(productsTable.categoryId, categories.id))
        .where(eq(productsTable.published, true))
        .orderBy(asc(categories.name));
    return rows.map((r) => r.name);
}

// Categorías con la foto de uno de sus productos publicados (el destacado primero).
export async function getCategoryCards(): Promise<{ name: string; image: string }[]> {
    const rows = await db
        .select({ name: categories.name, imageId: productsTable.imageId, featured: productsTable.featured })
        .from(categories)
        .innerJoin(productsTable, eq(productsTable.categoryId, categories.id))
        .where(eq(productsTable.published, true))
        .orderBy(asc(categories.name), asc(productsTable.name));
    const byName = new Map<string, { name: string; image: string; featured: boolean }>();
    for (const row of rows) {
        const image = imageUrl(row.imageId, 300);
        const current = byName.get(row.name);
        if (!current) byName.set(row.name, { name: row.name, image, featured: row.featured && !!image });
        else if (image && (!current.image || (row.featured && !current.featured))) {
            byName.set(row.name, { name: row.name, image, featured: row.featured });
        }
    }
    return [...byName.values()].map(({ name, image }) => ({ name, image }));
}

export type ProductSort = "nombre" | "precio-asc" | "precio-desc";
export const PRODUCTS_PER_PAGE = 12;

// Minúsculas y sin acentos, para que "arnica" encuentre "Árnica". Equivale al normalize() del cliente.
const fold = (column: ReturnType<typeof sql> | typeof productsTable.name) =>
    sql`translate(lower(${column}), 'áéíóúüñ', 'aeiouun')`;

// Filtra, ordena y pagina en la base en lugar de cargar todo el catálogo en memoria.
export async function searchProducts(options: { category?: string; query?: string; sort?: ProductSort; page?: number }) {
    const { category, query, sort = "nombre", page = 1 } = options;

    // % y _ son comodines de LIKE: se escapan para que la búsqueda sea literal.
    const needle = query?.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\\%_]/g, "\\$&");

    const where = and(
        eq(productsTable.published, true),
        category ? eq(categories.name, category) : undefined,
        needle ? sql`${fold(productsTable.name)} like ${`%${needle}%`}` : undefined,
    );

    const [{ total }] = await db
        .select({ total: count() })
        .from(productsTable)
        .innerJoin(categories, eq(productsTable.categoryId, categories.id))
        .where(where);

    const order =
        sort === "precio-asc" ? [asc(productsTable.priceCents), asc(productsTable.name)]
        : sort === "precio-desc" ? [desc(productsTable.priceCents), asc(productsTable.name)]
        : [asc(fold(productsTable.name)), asc(productsTable.id)];

    const rows = await db
        .select(columns)
        .from(productsTable)
        .innerJoin(categories, eq(productsTable.categoryId, categories.id))
        .where(where)
        .orderBy(...order)
        .limit(PRODUCTS_PER_PAGE)
        .offset((page - 1) * PRODUCTS_PER_PAGE);

    return { products: rows.map(toProduct), total, totalPages: Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE)) };
}
