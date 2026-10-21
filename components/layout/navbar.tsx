import Image from "next/image"
import Link from "next/link"
import { User, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MobileMenu } from "@/components/layout/mobile-menu"
import { CartLink } from "@/components/cart/cart-link"

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/60">
            <div className="container-custom flex h-16 items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/brand/logo-small.webp"
                            alt="Homeopáticos Schüssler"
                            width={600}
                            height={198}
                            priority
                            className="h-10 w-auto"
                        />
                    </Link>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link href="/" className="transition-colors hover:text-[var(--primary)]">
                            Inicio
                        </Link>
                        <Link href="/productos" className="transition-colors hover:text-[var(--primary)]">
                            Productos
                        </Link>
                        <Link href="/nosotros" className="transition-colors hover:text-[var(--primary)]">
                            Nosotros
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-2">
                    <form action="/productos" role="search" className="hidden md:flex relative mr-4">
                        <label htmlFor="site-search" className="sr-only">Buscar productos</label>
                        <input
                            id="site-search"
                            name="q"
                            type="search"
                            placeholder="Buscar..."
                            className="h-9 w-64 rounded-md border border-[var(--border)] bg-transparent px-3 py-1 pr-9 text-sm shadow-sm transition-colors placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--primary)]"
                        />
                        <button type="submit" aria-label="Buscar" className="absolute right-2 top-2.5">
                            <Search className="h-4 w-4 text-[var(--muted-foreground)]" />
                        </button>
                    </form>

                    <Link href="/auth/login">
                        <Button variant="ghost" size="icon">
                            <User className="h-5 w-5" />
                            <span className="sr-only">Cuenta</span>
                        </Button>
                    </Link>

                    <CartLink />

                    <MobileMenu />
                </div>
            </div>
            <form action="/productos" role="search" className="container-custom relative pb-3 md:hidden">
                <label htmlFor="mobile-search" className="sr-only">Buscar productos</label>
                <input
                    id="mobile-search"
                    name="q"
                    type="search"
                    placeholder="Buscar productos..."
                    className="h-10 w-full rounded-md border border-[var(--border)] bg-transparent px-3 pr-10 text-sm placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--primary)]"
                />
                <button type="submit" aria-label="Buscar" className="absolute right-7 top-2.5 sm:right-9">
                    <Search className="h-4 w-4 text-[var(--muted-foreground)]" />
                </button>
            </form>
        </header>
    )
}
