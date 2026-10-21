import Link from "next/link"
import { ArrowRight, Search, ShoppingCart, Truck, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/shop/product-card"
import { getFeaturedProducts, getStoreCategories } from "@/lib/products"

export default async function Home() {
  const [categories, featuredProducts] = await Promise.all([getStoreCategories(), getFeaturedProducts()])

  return (
    <div className="flex flex-col">
      {/* Presentación compacta */}
      <section className="bg-[var(--muted)] py-10 md:py-14">
        <div className="container-custom max-w-3xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">Homeopáticos Schüssler</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--muted-foreground)]">
            Consulta nuestro catálogo y encuentra tu presentación.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <Link href="/productos">
              <Button size="lg" className="gap-2">
                Ver productos <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a
              href="mailto:contacto@schussler.com.mx"
              className="text-sm font-medium text-[var(--primary)] underline-offset-4 hover:underline"
            >
              Escríbenos a contacto@schussler.com.mx
            </a>
          </div>
        </div>
        <div aria-hidden className="mx-auto mt-10 h-1.5 max-w-5xl bg-[var(--silver)] [clip-path:polygon(0_0,100%_0,92%_100%,0_100%)]" />
      </section>

      {/* Categorías */}
      <section className="py-12">
        <div className="container-custom">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">Categorías</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/productos?categoria=${encodeURIComponent(category)}`}
                className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-5 text-center font-medium transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
              >
                {category}
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
              <Search className="mt-1 h-6 w-6 shrink-0 text-[var(--primary)]" />
              <div>
                <h3 className="font-semibold">1. Encuentra tu producto</h3>
                <p className="text-sm text-[var(--muted-foreground)]">Usa el buscador o recorre las categorías.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <ShoppingCart className="mt-1 h-6 w-6 shrink-0 text-[var(--primary)]" />
              <div>
                <h3 className="font-semibold">2. Agrégalo al carrito</h3>
                <p className="text-sm text-[var(--muted-foreground)]">Revisa cantidades, subtotal y total antes de pagar.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Truck className="mt-1 h-6 w-6 shrink-0 text-[var(--primary)]" />
              <div>
                <h3 className="font-semibold">3. Recíbelo en CDMX</h3>
                <p className="text-sm text-[var(--muted-foreground)]">Envío gratis en compras superiores a $800; en compras menores se calcula según tu código postal.</p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 rounded-lg border border-[var(--border)] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Store className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]" />
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
    </div>
  )
}
