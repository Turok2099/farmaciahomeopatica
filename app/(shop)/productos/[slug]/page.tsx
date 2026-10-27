import { notFound } from "next/navigation"
import { getProductBySlug } from "@/lib/products"
import { ProductPurchase } from "@/components/cart/add-to-cart"
import { DeliveryPromise } from "@/components/shop/delivery-promise"
import { CheckIcon, TruckIcon, BuildingStorefrontIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"
import type { Metadata } from "next"
import { JsonLd } from "@/components/seo/json-ld"
import { SITE_URL, SITE_NAME } from "@/lib/site"

export async function generateMetadata(
    props: {
        params: Promise<{ slug: string }>;
    }
): Promise<Metadata> {
    const params = await props.params;
    const product = await getProductBySlug(params.slug)
    if (!product) return { title: "Producto no encontrado", robots: { index: false } }

    const description = product.description
        || `Compra ${product.name}${product.presentation ? ` (${product.presentation})` : ""} en Homeopáticos Schüssler. Entrega a domicilio en CDMX o recoge en sucursal.`
    const images = product.image ? [{ url: product.image, alt: product.name }] : undefined

    return {
        title: product.name,
        description,
        alternates: { canonical: `/productos/${product.slug}` },
        openGraph: { type: "website", title: product.name, description, url: `/productos/${product.slug}`, images },
        twitter: { card: images ? "summary_large_image" : "summary", title: product.name, description, images: images?.map((i) => i.url) },
    }
}

export default async function ProductPage(
    props: {
        params: Promise<{ slug: string }>;
    }
) {
    const params = await props.params;
    const product = await getProductBySlug(params.slug)

    if (!product) {
        notFound()
    }

    const url = `${SITE_URL}/productos/${product.slug}`
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Product",
                "@id": `${url}#producto`,
                name: product.name,
                description: product.description || undefined,
                image: product.image || undefined,
                category: product.category,
                brand: { "@type": "Brand", name: SITE_NAME },
                offers: {
                    "@type": "Offer",
                    url,
                    priceCurrency: "MXN",
                    price: product.price.toFixed(2),
                    availability: product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                    itemCondition: "https://schema.org/NewCondition",
                    seller: { "@id": `${SITE_URL}/#negocio` },
                    eligibleRegion: { "@type": "AdministrativeArea", name: "Ciudad de México" },
                },
            },
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
                    { "@type": "ListItem", position: 2, name: "Productos", item: `${SITE_URL}/productos` },
                    { "@type": "ListItem", position: 3, name: product.name, item: url },
                ],
            },
        ],
    }

    return (
        <div className="container-custom py-10">
            <JsonLd data={structuredData} />
            <div className="mb-6 text-sm text-[var(--muted-foreground)]">
                <Link href="/productos" className="hover:text-[var(--primary)]">Productos</Link>
                <span className="mx-2">/</span>
                <span className="text-[var(--foreground)]">{product.name}</span>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
                {/* Product Image Placeholder */}
                <div className="aspect-square bg-white rounded-xl overflow-hidden border border-[var(--border)] relative">
                    {product.image ? (
                        <CloudinaryImage
                            src={product.image}
                            alt={product.name}
                            sizes="(min-width: 768px) 50vw, 100vw"
                            priority
                            className="object-contain p-4"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-[var(--muted-foreground)] text-4xl font-bold">
                            {product.name.charAt(0)}
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="flex flex-col justify-center">
                    <div className="mb-2">
                        <span className="inline-block rounded-full bg-[var(--secondary)] px-3 py-1 text-xs font-semibold text-[var(--secondary-foreground)]">
                            {product.category}
                        </span>
                    </div>
                    <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
                    {product.presentation && <p className="mb-4 text-[var(--muted-foreground)]">{product.presentation}</p>}
                    {product.description && (
                        <p className="text-xl text-[var(--muted-foreground)] mb-6">{product.description}</p>
                    )}

                    <div className="flex items-center gap-4 mb-8">
                        <span className="text-3xl font-bold text-[var(--primary)]">{new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(product.price)}</span>
                        {product.available ? (
                            <span className="flex items-center text-sm text-[var(--accent)] font-medium bg-[var(--accent)]/10 px-2 py-1 rounded">
                                <CheckIcon className="mr-1 h-3 w-3" /> Disponible
                            </span>
                        ) : (
                            <span className="text-sm text-red-500 font-medium">Agotado</span>
                        )}
                    </div>

                    <div className="mb-8">
                        <ProductPurchase product={product} />
                    </div>

                    <DeliveryPromise />

                    <div className="border-t border-[var(--border)] pt-6 space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                            <TruckIcon className="h-5 w-5 shrink-0 text-[var(--primary)] mt-0.5" />
                            <p className="text-[var(--muted-foreground)]">
                                Entrega a domicilio en CDMX: gratis en compras superiores a $800; en compras menores el costo se calcula según tu código postal.{" "}
                                <Link href="/envios" className="text-[var(--primary)] hover:underline">Ver condiciones</Link>
                            </p>
                        </div>
                        <div className="flex items-start gap-3">
                            <BuildingStorefrontIcon className="h-5 w-5 shrink-0 text-[var(--primary)] mt-0.5" />
                            <p className="text-[var(--muted-foreground)]">O recógelo en sucursal: Alfonso Reyes 234, Ciudad de México.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
