'use client'

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const links = [
    { href: "/", label: "Inicio" },
    { href: "/productos", label: "Productos" },
    { href: "/nosotros", label: "Nosotros" },
    { href: "/contacto", label: "Contacto" },
]

export function MobileMenu() {
    const [open, setOpen] = useState(false)

    return (
        <div className="md:hidden">
            <Button
                variant="ghost"
                size="icon"
                className="hover:bg-white/15 hover:text-white"
                aria-label={open ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={open}
                aria-controls="mobile-nav"
                onClick={() => setOpen((value) => !value)}
            >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            {open && (
                <nav
                    id="mobile-nav"
                    aria-label="Menú principal"
                    className="absolute inset-x-0 top-full border-b border-[var(--border)] bg-[var(--background)] shadow-md"
                >
                    <ul className="container-custom flex flex-col py-2">
                        {links.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    className="block py-3 text-sm font-medium hover:text-[var(--primary)]"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </div>
    )
}
