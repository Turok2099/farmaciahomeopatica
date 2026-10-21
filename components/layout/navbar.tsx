import Image from "next/image"
import Link from "next/link"
import { User, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MobileMenu } from "@/components/layout/mobile-menu"
import { CartLink } from "@/components/cart/cart-link"

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[var(--brand)] text-white">
            <div className="container-custom flex h-20 items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/brand/logo-small.webp"
                            alt="Homeopáticos Schüssler"
                            width={600}
                            height={198}
                            priority
                            className="h-12 w-auto sm:h-14"
                        />
                    </Link>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link href="/" className="rounded-sm transition-colors hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-white">
                            Inicio
                        </Link>
                        <Link href="/productos" className="rounded-sm transition-colors hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-white">
                            Productos
                        </Link>
                        <Link href="/nosotros" className="rounded-sm transition-colors hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-white">
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
                            className="h-9 w-64 rounded-md border border-transparent bg-white px-3 py-1 pr-9 text-sm text-[#172b3a] shadow-sm placeholder:text-[#5b6b78] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        />
                        <button type="submit" aria-label="Buscar" className="absolute right-2 top-2.5">
                            <Search className="h-4 w-4 text-[#5b6b78]" />
                        </button>
                    </form>

                    <Link href="/auth/login" className="rounded-md focus-visible:outline-2 focus-visible:outline-white">
                        <Button variant="ghost" size="icon" className="hover:bg-white/15 hover:text-white">
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
                    className="h-10 w-full rounded-md border border-transparent bg-white px-3 pr-10 text-sm text-[#172b3a] placeholder:text-[#5b6b78] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                />
                <button type="submit" aria-label="Buscar" className="absolute right-7 top-2.5 sm:right-9">
                    <Search className="h-4 w-4 text-[#5b6b78]" />
                </button>
            </form>
        </header>
    )
}
