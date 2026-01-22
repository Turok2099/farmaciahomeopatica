import Link from "next/link"
import { ShoppingCart, Menu, User, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/60">
            <div className="container-custom flex h-16 items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-[var(--primary)]">Medicamento Homeopáticos Schussler</span>
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
                    <div className="hidden md:flex relative mr-4">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="h-9 w-64 rounded-md border border-[var(--border)] bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--primary)]"
                        />
                        <Search className="absolute right-2 top-2.5 h-4 w-4 text-[var(--muted-foreground)]" />
                    </div>

                    <Link href="/auth/login">
                        <Button variant="ghost" size="icon">
                            <User className="h-5 w-5" />
                            <span className="sr-only">Cuenta</span>
                        </Button>
                    </Link>

                    <Link href="/carrito">
                        <Button variant="ghost" size="icon">
                            <ShoppingCart className="h-5 w-5" />
                            <span className="sr-only">Carrito</span>
                        </Button>
                    </Link>

                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Menu</span>
                    </Button>
                </div>
            </div>
        </header>
    )
}
