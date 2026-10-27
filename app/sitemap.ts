import type { MetadataRoute } from "next"
import { getProducts } from "@/lib/products"
import { SITE_URL } from "@/lib/site"

// Se regenera cada hora: los productos publicados cambian desde el panel admin.
export const revalidate = 3600

const STATIC_PAGES = [
    { path: "", priority: 1 },
    { path: "/productos", priority: 0.9 },
    { path: "/envios", priority: 0.5 },
    { path: "/faq", priority: 0.5 },
    { path: "/nosotros", priority: 0.4 },
    { path: "/contacto", priority: 0.4 },
    { path: "/privacidad", priority: 0.2 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const products = await getProducts().catch(() => [])

    return [
        ...STATIC_PAGES.map((p) => ({ url: `${SITE_URL}${p.path}`, priority: p.priority })),
        ...products.map((p) => ({ url: `${SITE_URL}/productos/${p.slug}`, priority: 0.7 })),
    ]
}
