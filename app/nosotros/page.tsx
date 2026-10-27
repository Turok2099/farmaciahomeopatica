import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Nosotros",
    alternates: { canonical: "/nosotros" },
    description: "Conoce Homeopáticos Schüssler, con sucursal en la Ciudad de México.",
}

export default function Page() {
    return (
        <div className="container-custom max-w-3xl py-10">
            <h1 className="text-3xl font-bold mb-6">Nosotros</h1>
            <div className="space-y-4 text-[var(--muted-foreground)]">
                <p>
                    Homeopáticos Schüssler es una farmacia con sucursal en la Ciudad de México. Esta tienda en línea
                    te permite consultar nuestro catálogo y recibir tus productos en CDMX o recogerlos en sucursal.
                </p>
                <p>
                    Visítanos en Alfonso Reyes 234, Ciudad de México, o escríbenos a{" "}
                    <a href="mailto:contacto@schussler.com.mx" className="text-[var(--primary)] hover:underline">contacto@schussler.com.mx</a>.
                </p>
                <p>
                    <Link href="/productos" className="text-[var(--primary)] hover:underline">Ver catálogo</Link>
                </p>
            </div>
        </div>
    )
}
