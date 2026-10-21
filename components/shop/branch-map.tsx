import { Clock, MapPin, Store } from "lucide-react"
import { Button } from "@/components/ui/button"

// Coordenadas y enlace de inserción tomados del código "Insertar un mapa" de la ficha de Google Maps
// "HOMEOPATICOS SCHUSSLER CONDESA" proporcionada por el negocio.
const EMBED_SRC =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3763.1270681341284!2d-99.17285489999999!3d19.406914999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85ce006393a809b1%3A0x2fbdadb2c110f4d0!2sHOMEOPATICOS%20SCHUSSLER%20CONDESA!5e0!3m2!1ses!2smx!4v1792604441108!5m2!1ses!2smx"
const DIRECTIONS_URL = "https://www.google.com/maps/dir/?api=1&destination=19.406915%2C-99.172855"

export function BranchMap() {
    return (
        <section aria-labelledby="sucursal-titulo" className="border-t border-[var(--silver)]/40 bg-[var(--muted)] py-12">
            <div className="container-custom grid gap-8 lg:grid-cols-2 lg:items-center">
                <div>
                    <h2 id="sucursal-titulo" className="text-2xl font-semibold tracking-tight">Visítanos en sucursal</h2>
                    <p className="mt-2 text-[var(--muted-foreground)]">Consulta nuestra ubicación y planea tu visita.</p>
                    <ul className="mt-6 space-y-4 text-sm">
                        <li className="flex items-start gap-3">
                            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]" aria-hidden />
                            <span>
                                <span className="block font-semibold">Homeopáticos Schüssler</span>
                                Alfonso Reyes 234, Ciudad de México
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]" aria-hidden />
                            <span>Despachos de 10:00 a 17:00 h; los pedidos posteriores salen el siguiente día hábil.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Store className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]" aria-hidden />
                            <span>Puedes recoger tu pedido en sucursal sin costo de envío.</span>
                        </li>
                    </ul>
                    <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]">
                        <Button size="lg" tabIndex={-1}>
                            Cómo llegar
                            <span className="sr-only"> (se abre en una pestaña nueva)</span>
                        </Button>
                    </a>
                </div>
                <div className="h-[300px] w-full overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)] lg:h-[380px]">
                    <iframe
                        src={EMBED_SRC}
                        title="Mapa de la sucursal de Homeopáticos Schüssler en la Ciudad de México"
                        loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        className="h-full w-full border-0"
                    />
                </div>
            </div>
        </section>
    )
}
