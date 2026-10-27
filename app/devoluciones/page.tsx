import type { Metadata } from "next"
import Link from "next/link"
import { WhatsAppButton } from "@/components/shop/whatsapp-button"

export const metadata: Metadata = {
    title: "Política de devoluciones",
    alternates: { canonical: "/devoluciones" },
    description: "Política de devoluciones de Homeopáticos Schüssler: no aceptamos devoluciones, salvo producto dañado o distinto al pedido.",
}

const mail = "mailto:contacto@schussler.com.mx"
const link = "text-[var(--primary)] hover:underline"
const h2 = "pt-4 text-xl font-semibold text-[var(--foreground)]"

export default function Page() {
    return (
        <div className="container-custom max-w-3xl py-10">
            <h1 className="text-3xl font-bold mb-2">Política de devoluciones</h1>
            <p className="mb-6 text-sm text-[var(--muted-foreground)]">Última actualización: 26 de octubre de 2026</p>
            <div className="space-y-4 text-[var(--muted-foreground)]">
                <h2 className={h2}>No hay devoluciones de productos</h2>
                <p>
                    Por tratarse de medicamentos y productos de uso en la salud, no aceptamos devoluciones ni cambios por gusto, arrepentimiento
                    o error al elegir el producto. Revisa tu pedido con cuidado antes de pagar.
                </p>

                <h2 className={h2}>Excepciones</h2>
                <p>Revisaremos tu caso y repondremos el producto o te reembolsaremos el pago si:</p>
                <ul className="list-disc space-y-2 pl-6">
                    <li>el producto llegó dañado o con el empaque abierto;</li>
                    <li>recibiste un producto distinto al que pediste;</li>
                    <li>el producto llegó caducado.</li>
                </ul>
                <p>
                    Para solicitarlo, avísanos dentro de las <strong>48 horas</strong> posteriores a la entrega, con tu número de pedido (SCH-XXXXXX) y fotografías del producto y su empaque.
                    No podremos aceptar productos usados ni con el sello roto por el cliente.
                </p>
                <p>
                    <a href={mail} className={link}>contacto@schussler.com.mx</a> · 55 4521 0178 ·{" "}
                    <WhatsAppButton message="Hola, tuve un problema con mi pedido. Mi número de pedido es: ">Escribir por WhatsApp</WhatsAppButton>
                </p>

                <h2 className={h2}>Cancelación antes del envío</h2>
                <p>
                    Si necesitas cancelar un pedido que aún no hemos preparado o entregado, contáctanos lo antes posible. Si aún no sale de la tienda, lo cancelamos y reembolsamos.
                </p>

                <h2 className={h2}>Reembolsos</h2>
                <p>
                    Los reembolsos autorizados se hacen al mismo medio de pago con el que compraste. Nosotros lo emitimos en un plazo de hasta 5 días hábiles tras aprobarlo,
                    y el banco puede tardar de 5 a 10 días hábiles adicionales en reflejarlo. Si el motivo no es un error nuestro, el reembolso puede no incluir la comisión de procesamiento de pago.
                </p>

                <p>
                    Más información en nuestros <Link href="/terminos" className={link}>términos y condiciones</Link> y en <Link href="/envios" className={link}>envíos y entrega</Link>.
                </p>
            </div>
        </div>
    )
}
