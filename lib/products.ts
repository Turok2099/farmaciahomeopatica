import { and, asc, eq, inArray } from "drizzle-orm";
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
