import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon, MagnifyingGlassIcon, ShoppingCartIcon, TruckIcon, BuildingStorefrontIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"
import { BranchMap } from "@/components/shop/branch-map"
import { ProductCard } from "@/components/shop/product-card"
import { getFeaturedProducts, getCategoryCards } from "@/lib/products"
import { JsonLd } from "@/components/seo/json-ld"
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, DEFAULT_OG_IMAGE, ADDRESS, GEO, OPENING_HOURS, SOCIAL_PROFILES } from "@/lib/site"

export const metadata: Metadata = {
  alternates: { canonical: "/" },
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: "es-MX",
    },
    {
      "@type": "Pharmacy",
      "@id": `${SITE_URL}/#negocio`,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
      address: ADDRESS,
      geo: GEO,
      openingHoursSpecification: OPENING_HOURS,
      areaServed: { "@type": "City", name: "Ciudad de México" },
      priceRange: "$$",
      currenciesAccepted: "MXN",
      sameAs: SOCIAL_PROFILES,
    },
  ],
}

export default async function Home() {
  const [categories, featuredProducts] = await Promise.all([getCategoryCards(), getFeaturedProducts()])

  return (
    <div className="flex flex-col">
      <JsonLd data={structuredData} />
      {/* Portada: en escritorio el texto va sobre el espacio libre de la imagen; en móvil, encima de ella */}
      <section className="relative bg-[var(--background)]">
        <div className="container-custom pb-6 pt-8 lg:absolute lg:inset-0 lg:z-10 lg:flex lg:items-center lg:pb-0 lg:pt-0">
          <div className="max-w-xl lg:max-w-[36%] lg:text-[#172b3a]">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl xl:text-5xl">Homeopáticos Schüssler</h1>
            <p className="mt-3 text-lg text-[var(--muted-foreground)] lg:text-[#3d4f5c]">
              Consulta nuestro catálogo y encuentra tu presentación.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href="/productos">
                <Button size="lg" className="gap-2">
                  Ver productos <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </Link>
              <Link
                href="/contacto"
                className="rounded-sm text-sm font-medium text-[var(--primary)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] lg:text-[#014c80]"
              >
                ¿Necesitas ayuda?
              </Link>
            </div>
          </div>
        </div>
        <Image
          src="/images/portada-homeopaticos-schussler.png"
          alt="Productos Homeopáticos Schüssler: jarabe, gel, aceite, pomada y sales sobre una base de piedra con hojas verdes"
          width={1944}
          height={809}
          priority
          fetchPriority="high"
          sizes="100vw"
          className="h-auto w-full"
        />
      </section>

      {/* Categorías */}
      <section className="border-t border-[var(--silver)]/40 py-12">
        <div className="container-custom">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">Categorías</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/productos?categoria=${encodeURIComponent(category.name)}`}
                className="group flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] p-2 pr-3 transition-colors hover:border-[var(--primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
              >
                <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white">
                  {category.image ? (
                    <CloudinaryImage src={category.image} alt="" sizes="56px" className="object-contain p-1" />
                  ) : (
                    <span className="text-sm font-semibold text-[#5b6b78]">{category.name.substring(0, 2)}</span>
                  )}
                </span>
                <span className="text-sm font-medium leading-tight group-hover:text-[var(--primary)]">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Selección de productos */}
      {featuredProducts.length > 0 && (
      <section className="bg-[var(--muted)] py-12">
        <div className="container-custom">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Selección de productos</h2>
            <Link href="/productos" className="text-sm font-medium text-[var(--primary)] hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Cómo comprar, entregas y contacto */}
      <section className="py-12">
        <div className="container-custom">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">Cómo comprar</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex gap-4">
              <MagnifyingGlassIcon className="mt-1 h-6 w-6 shrink-0 text-[var(--primary)]" />
              <div>
                <h3 className="font-semibold">1. Encuentra tu producto</h3>
                <p className="text-sm text-[var(--muted-foreground)]">Usa el buscador o recorre las categorías.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <ShoppingCartIcon className="mt-1 h-6 w-6 shrink-0 text-[var(--primary)]" />
              <div>
                <h3 className="font-semibold">2. Agrégalo al carrito</h3>
                <p className="text-sm text-[var(--muted-foreground)]">Revisa cantidades, subtotal y total antes de pagar.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <TruckIcon className="mt-1 h-6 w-6 shrink-0 text-[var(--primary)]" />
              <div>
                <h3 className="font-semibold">3. Recíbelo en CDMX</h3>
                <p className="text-sm text-[var(--muted-foreground)]">Envío gratis en compras superiores a $800; en compras menores se calcula según tu código postal.</p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 rounded-lg border border-[var(--border)] bg-[var(--muted)] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <BuildingStorefrontIcon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]" />
              <p className="text-sm">
                <span className="font-semibold">También puedes recoger en sucursal:</span> Alfonso Reyes 234, Ciudad de México.
              </p>
            </div>
            <Link href="/contacto" className="text-sm font-medium text-[var(--primary)] hover:underline">
              Contacto y horarios
            </Link>
          </div>
        </div>
      </section>

      <BranchMap />
    </div>
  )
}
