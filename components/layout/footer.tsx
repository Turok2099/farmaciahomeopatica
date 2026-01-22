import Link from "next/link"

export function Footer() {
    return (
        <footer className="border-t border-[var(--border)] bg-[var(--muted)]/50">
            <div className="container-custom py-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-lg font-bold text-[var(--primary)] mb-4">Medicamento Homeopáticos Schussler</h3>
                        <p className="text-sm text-[var(--muted-foreground)]">
                            Tu fuente confiable de medicamentos homeopáticos y productos naturales para el bienestar integral.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-medium mb-4">Enlaces Rápidos</h4>
                        <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                            <li><Link href="/productos" className="hover:text-[var(--primary)]">Productos</Link></li>
                            <li><Link href="/nosotros" className="hover:text-[var(--primary)]">Sobre Nosotros</Link></li>
                            <li><Link href="/contacto" className="hover:text-[var(--primary)]">Contacto</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium mb-4">Ayuda</h4>
                        <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                            <li><Link href="/faq" className="hover:text-[var(--primary)]">Preguntas Frecuentes</Link></li>
                            <li><Link href="/envios" className="hover:text-[var(--primary)]">Envíos y Devoluciones</Link></li>
                            <li><Link href="/privacidad" className="hover:text-[var(--primary)]">Política de Privacidad</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium mb-4">Contacto</h4>
                        <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                            <li>info@naturapharma.com</li>
                            <li>+52 (55) 1234 5678</li>
                            <li>Calle Naturaleza 123, CDMX</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-[var(--border)] text-center text-sm text-[var(--muted-foreground)]">
                    &copy; {new Date().getFullYear()} Medicamento Homeopáticos Schussler. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    )
}
