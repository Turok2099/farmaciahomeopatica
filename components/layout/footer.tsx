import Link from "next/link"

export function Footer() {
    return (
        <footer className="border-t border-[var(--border)] bg-[var(--muted)]">
            <div aria-hidden className="h-1.5 bg-[var(--silver)] [clip-path:polygon(0_0,100%_0,92%_100%,0_100%)]" />
            <div className="container-custom py-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-lg font-bold text-[var(--primary)] mb-4">Homeopáticos Schüssler</h3>
                        <p className="text-sm text-[var(--muted-foreground)]">
                            Catálogo de productos con venta y entregas en la Ciudad de México.
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
                            <li><Link href="/envios" className="hover:text-[var(--primary)]">Envíos y entrega</Link></li>
                            <li><Link href="/privacidad" className="hover:text-[var(--primary)]">Aviso de privacidad</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium mb-4">Contacto</h4>
                        <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                            <li><a href="mailto:contacto@schussler.com.mx" className="hover:text-[var(--primary)]">contacto@schussler.com.mx</a></li>
                            <li>Alfonso Reyes 234, Ciudad de México</li>
                            <li>Despachos de 10:00 a 17:00 h; pedidos posteriores salen el siguiente día hábil.</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-[var(--border)] text-center text-sm text-[var(--muted-foreground)]">
                    &copy; {new Date().getFullYear()} Homeopáticos Schüssler. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    )
}
