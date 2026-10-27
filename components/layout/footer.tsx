import Link from "next/link"
import { ClockIcon, EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/outline"
import { SocialLinks } from "@/components/shop/social-links"
import { HOURS_LINES } from "@/lib/store-hours"

const linkClass = "inline-block rounded-sm py-1 text-white/85 underline-offset-4 hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-white"

export function Footer() {
    return (
        <footer className="bg-[var(--brand)] text-white">
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div>
                        <h3 className="mb-3 text-lg font-semibold">Homeopáticos Schüssler</h3>
                        <p className="text-sm text-white/85">
                            Catálogo de productos con venta y entregas en la Ciudad de México.
                        </p>
                        <SocialLinks className="mt-4" />
                    </div>

                    <div>
                        <h4 className="mb-3 font-medium">Contacto</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2">
                                <EnvelopeIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                                <a href="mailto:contacto@schussler.com.mx" className={linkClass}>contacto@schussler.com.mx</a>
                            </li>
                            <li className="flex items-start gap-2 text-white/85">
                                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                                Alfonso Reyes 234, Ciudad de México
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-3 font-medium">Horarios</h4>
                        <div className="flex items-start gap-2 text-sm text-white/85">
                            <ClockIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                            <dl className="space-y-1">
                                {HOURS_LINES.map((line) => (
                                    <div key={line.days}><dt className="inline">{line.days}: </dt><dd className="inline">{line.hours}</dd></div>
                                ))}
                            </dl>
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-3 font-medium">Ayuda</h4>
                        <ul className="space-y-1 text-sm">
                            <li><Link href="/contacto" className={linkClass}>Contacto</Link></li>
                            <li><Link href="/faq" className={linkClass}>Preguntas frecuentes</Link></li>
                            <li><Link href="/envios" className={linkClass}>Envíos y entrega</Link></li>
                            <li><Link href="/productos" className={linkClass}>Productos</Link></li>
                            <li><Link href="/nosotros" className={linkClass}>Sobre nosotros</Link></li>
                            <li><Link href="/privacidad" className={linkClass}>Aviso de privacidad</Link></li>
                            <li><Link href="/terminos" className={linkClass}>Términos y condiciones</Link></li>
                            <li><Link href="/devoluciones" className={linkClass}>Política de devoluciones</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 border-t border-[var(--silver)]/40 pt-6 text-center text-sm text-white/80">
                    &copy; {new Date().getFullYear()} Homeopáticos Schüssler. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    )
}
