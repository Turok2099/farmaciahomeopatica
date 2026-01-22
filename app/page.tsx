import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Leaf, ShieldCheck, Heart } from "lucide-react"
import { products } from "@/lib/data"
import { ProductCard } from "@/components/shop/product-card"

export default function Home() {
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-[var(--secondary)]/30 py-20 overflow-hidden">
        <div className="container-custom relative z-10 grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <div className="inline-block rounded-full bg-[var(--primary)]/10 px-3 py-1 text-sm font-medium text-[var(--primary)]">
              Bienestar Natural
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl text-[var(--foreground)]">
              Tu Salud, <span className="text-[var(--primary)]">Naturalmente</span> Equilibrada
            </h1>
            <p className="text-lg text-[var(--muted-foreground)] md:text-xl max-w-lg">
              Descubre nuestra selección premium de medicamentos homeopáticos diseñados para restaurar tu vitalidad y armonía.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/productos">
                <Button size="lg" className="gap-2">
                  Explorar Catálogo <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/nosotros">
                <Button size="lg" variant="outline">
                  Conócenos
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            {/* Abstract shape or image placeholder */}
            <div className="w-80 h-80 rounded-full bg-[var(--primary)]/20 animate-pulse blur-3xl absolute"></div>
            <div className="relative bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-sm border border-white/20">
              <div className="space-y-4">
                <div className="h-48 w-full bg-[var(--secondary)] rounded-lg flex items-center justify-center">
                  <Leaf className="h-20 w-20 text-[var(--primary)] opacity-50" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-2/3 bg-[var(--muted)] rounded"></div>
                  <div className="h-4 w-full bg-[var(--muted)] rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-[var(--background)]">
        <div className="container-custom">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center p-6 rounded-xl border border-[var(--border)] hover:border-[var(--primary)] transition-colors">
              <div className="mb-4 rounded-full bg-[var(--secondary)] p-4 text-[var(--primary)]">
                <Leaf className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-bold">100% Natural</h3>
              <p className="text-[var(--muted-foreground)]">Ingredientes de origen natural seleccionados cuidadosamente para tu bienestar.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-xl border border-[var(--border)] hover:border-[var(--primary)] transition-colors">
              <div className="mb-4 rounded-full bg-[var(--secondary)] p-4 text-[var(--primary)]">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Calidad Certificada</h3>
              <p className="text-[var(--muted-foreground)]">Productos elaborados bajo los más estrictos estándares de calidad farmacéutica.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-xl border border-[var(--border)] hover:border-[var(--primary)] transition-colors">
              <div className="mb-4 rounded-full bg-[var(--secondary)] p-4 text-[var(--primary)]">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Cuidado Integral</h3>
              <p className="text-[var(--muted-foreground)]">Enfoque holístico que trata el cuerpo y la mente para una salud duradera.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-[var(--muted)]/30">
        <div className="container-custom">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Destacados</h2>
              <p className="mt-2 text-[var(--muted-foreground)]">Nuestros productos más populares</p>
            </div>
            <Link href="/productos">
              <Button variant="ghost" className="hidden sm:flex group">
                Ver todos <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/productos">
              <Button variant="outline" className="w-full">Ver todos los productos</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-[var(--primary)] text-white">
        <div className="container-custom text-center">
          <h2 className="mb-4 text-3xl font-bold">Únete a nuestra comunidad</h2>
          <p className="mb-8 text-lg opacity-90 max-w-2xl mx-auto">
            Recibe consejos de salud, ofertas exclusivas y novedades sobre nuestros productos naturales.
          </p>
          <div className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-1 rounded-md border-0 px-4 py-2 text-[var(--foreground)] focus:ring-2 focus:ring-white/50"
            />
            <Button variant="secondary" className="bg-white text-[var(--primary)] hover:bg-white/90">
              Suscribirse
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
