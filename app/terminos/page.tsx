import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Términos y condiciones",
    alternates: { canonical: "/terminos" },
    description: "Términos y condiciones de compra en Homeopáticos Schüssler: pedidos, precios, pagos, entregas y uso del sitio.",
}

const mail = "mailto:contacto@schussler.com.mx"
const link = "text-[var(--primary)] hover:underline"
const h2 = "pt-4 text-xl font-semibold text-[var(--foreground)]"

export default function Page() {
    return (
        <div className="container-custom max-w-3xl py-10">
            <h1 className="text-3xl font-bold mb-2">Términos y condiciones</h1>
            <p className="mb-6 text-sm text-[var(--muted-foreground)]">Última actualización: 26 de octubre de 2026</p>
            <div className="space-y-4 text-[var(--muted-foreground)]">
                <h2 className={h2}>1. Quiénes somos</h2>
                <p>
                    Este sitio (schussler.com.mx) es operado por Luis Francisco Ramírez Solís (RFC RASL840914B13), con nombre comercial Homeopáticos Schüssler,
                    domicilio en Alfonso Reyes 234, Col. Condesa, C.P. 06140, Ciudad de México. Contacto:{" "}
                    <a href={mail} className={link}>contacto@schussler.com.mx</a> · 55 4521 0178.
                </p>
                <p>Al usar el sitio o hacer un pedido aceptas estos términos. Si no estás de acuerdo, no lo uses.</p>

                <h2 className={h2}>2. Información de los productos</h2>
                <p>
                    Los productos que vendemos son medicamentos homeopáticos. La información del sitio es solo orientativa y <strong>no sustituye la consulta con un médico</strong>.
                    Lee las indicaciones del empaque antes de usar cualquier producto. Consulta a un profesional de la salud si estás embarazada, en lactancia,
                    tienes una enfermedad o tomas otros medicamentos, y busca atención médica si los síntomas persisten.
                </p>
                <p>Las imágenes son ilustrativas y el empaque puede variar según el lote del fabricante.</p>

                <h2 className={h2}>3. Precios y disponibilidad</h2>
                <ul className="list-disc space-y-2 pl-6">
                    <li>Todos los precios están en pesos mexicanos (MXN) e incluyen impuestos.</li>
                    <li>El precio válido es el que se muestra al momento de pagar. Podemos modificar precios sin previo aviso, sin afectar pedidos ya pagados.</li>
                    <li>Los productos están sujetos a existencia. Si algún producto de tu pedido no está disponible, te contactaremos para ofrecerte una alternativa o reembolsarte esa parte.</li>
                    <li>Si detectamos un error evidente de precio, podemos cancelar el pedido y reembolsarte el total.</li>
                </ul>

                <h2 className={h2}>4. Cómo comprar y pagar</h2>
                <p>
                    Agregas productos al carrito, capturas tus datos de contacto y entrega, y pagas con tarjeta en la página segura de Stripe.
                    El pedido se confirma cuando el pago se aprueba y recibes un correo de confirmación con tu número de pedido (SCH-XXXXXX).
                    Si no completas el pago a tiempo, el pedido se cancela automáticamente. No almacenamos los datos de tu tarjeta.
                </p>
                <p>Debes ser mayor de edad y proporcionar datos verdaderos y completos. Si necesitas factura, solicítala por correo con tu número de pedido y tus datos fiscales.</p>

                <h2 className={h2}>5. Entrega</h2>
                <p>
                    Entregamos únicamente en la Ciudad de México, o puedes recoger tu pedido en sucursal. Las condiciones y costos están en{" "}
                    <Link href="/envios" className={link}>Envíos y entrega</Link>. Los tiempos de entrega son estimados y no constituyen una garantía.
                    Es tu responsabilidad capturar correctamente la dirección y estar disponible para recibir el pedido.
                </p>

                <h2 className={h2}>6. Devoluciones</h2>
                <p>
                    No se aceptan devoluciones de productos, salvo en los casos de producto dañado, distinto al pedido o caducado, descritos en la{" "}
                    <Link href="/devoluciones" className={link}>política de devoluciones</Link>.
                </p>

                <h2 className={h2}>7. Tu cuenta</h2>
                <p>
                    Eres responsable de mantener la confidencialidad de tu contraseña y de la actividad en tu cuenta. Avísanos si sospechas un uso no autorizado.
                    Podemos suspender cuentas que se usen de forma fraudulenta o abusiva.
                </p>

                <h2 className={h2}>8. Uso del sitio y propiedad intelectual</h2>
                <p>
                    Los textos, imágenes, logotipos y demás contenidos del sitio son propiedad de sus titulares y no pueden copiarse ni usarse con fines comerciales sin autorización.
                    No está permitido intentar vulnerar la seguridad del sitio, usar mecanismos automatizados para saturarlo o extraer su contenido de forma masiva.
                </p>

                <h2 className={h2}>9. Limitación de responsabilidad</h2>
                <p>
                    En la medida permitida por la ley, no somos responsables por el uso que se dé a los productos contrario a las indicaciones del fabricante,
                    ni por interrupciones del sitio ajenas a nuestro control. Nada de lo aquí dispuesto limita los derechos que la Ley Federal de Protección al Consumidor te otorga.
                </p>

                <h2 className={h2}>10. Privacidad</h2>
                <p>El tratamiento de tus datos se describe en el <Link href="/privacidad" className={link}>aviso de privacidad</Link>.</p>

                <h2 className={h2}>11. Cambios, ley aplicable y jurisdicción</h2>
                <p>
                    Podemos actualizar estos términos; los cambios se publican en esta página y aplican a partir de su publicación, sin afectar pedidos ya realizados.
                    Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Para cualquier controversia, las partes se someten a los tribunales competentes
                    de la Ciudad de México, sin perjuicio de que puedas acudir a la Procuraduría Federal del Consumidor (PROFECO).
                </p>
            </div>
        </div>
    )
}
