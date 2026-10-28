import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Aviso de privacidad",
    alternates: { canonical: "/privacidad" },
    description: "Aviso de privacidad de Homeopáticos Schüssler: qué datos recabamos, para qué los usamos y cómo ejercer tus derechos ARCO.",
}

const mail = "mailto:contacto@schussler.com.mx"
const link = "text-[var(--primary)] hover:underline"
const h2 = "pt-4 text-xl font-semibold text-[var(--foreground)]"

export default function Page() {
    return (
        <div className="container-custom max-w-3xl py-10">
            <h1 className="text-3xl font-bold mb-2">Aviso de privacidad</h1>
            <p className="mb-6 text-sm text-[var(--muted-foreground)]">Última actualización: 27 de octubre de 2026</p>
            <div className="space-y-4 text-[var(--muted-foreground)]">
                <h2 className={h2}>1. Responsable de tus datos</h2>
                <p>
                    Luis Francisco Ramírez Solís (RFC RASL840914B13), con nombre comercial Homeopáticos Schüssler y domicilio en
                    Alfonso Reyes 234, Col. Condesa, C.P. 06140, Ciudad de México, es responsable del tratamiento de tus datos personales,
                    conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.
                </p>

                <h2 className={h2}>2. Datos que recabamos</h2>
                <ul className="list-disc space-y-2 pl-6">
                    <li><strong>Al hacer un pedido:</strong> nombre, correo electrónico, teléfono, y si eliges entrega a domicilio, calle y número, colonia y código postal, además de las notas que quieras agregar.</li>
                    <li><strong>Al crear una cuenta:</strong> nombre, correo electrónico y contraseña (la guardamos cifrada, nunca en texto legible).</li>
                    <li><strong>Al navegar:</strong> tu dirección IP, que usamos solo para limitar intentos repetidos de acceso y proteger el sitio.</li>
                </ul>
                <p>
                    <strong>No recabamos datos de tu tarjeta.</strong> El pago se realiza en la página segura de Stripe, que procesa esos datos directamente.
                    Tampoco solicitamos datos sensibles de salud: no necesitamos que nos indiques padecimientos para comprar.
                </p>

                <h2 className={h2}>3. Para qué usamos tus datos</h2>
                <p>Finalidades necesarias para tu compra:</p>
                <ul className="list-disc space-y-2 pl-6">
                    <li>Procesar y entregar tu pedido, o prepararlo para que lo recojas en sucursal.</li>
                    <li>Enviarte la confirmación de tu pedido y comunicarnos contigo si hay algún problema con él.</li>
                    <li>Administrar tu cuenta y permitirte recuperar tu contraseña.</li>
                    <li>Cumplir obligaciones legales, fiscales y de seguridad, y prevenir fraudes y abusos.</li>
                </ul>
                <p>No usamos tus datos para publicidad ni los vendemos.</p>

                <h2 className={h2}>4. Con quién los compartimos</h2>
                <p>Solo con proveedores que nos ayudan a operar la tienda, que los usan únicamente para ese fin:</p>
                <ul className="list-disc space-y-2 pl-6">
                    <li><strong>Stripe:</strong> procesamiento del pago.</li>
                    <li><strong>Resend:</strong> envío de correos de confirmación y de recuperación de contraseña.</li>
                    <li><strong>Neon y Vercel:</strong> almacenamiento de la base de datos y alojamiento del sitio.</li>
                    <li><strong>Google Analytics:</strong> medición estadística del uso del sitio, solo si aceptas las cookies de analítica.</li>
                </ul>
                <p>
                    Algunos de estos proveedores operan servidores fuera de México, por lo que tus datos pueden transferirse a otros países.
                    También podremos compartirlos con una autoridad cuando una ley o una orden la exija.
                </p>

                <h2 className={h2}>5. Tus derechos (ARCO)</h2>
                <p>
                    Tienes derecho a <strong>acceder</strong> a tus datos, <strong>rectificarlos</strong>, <strong>cancelarlos</strong> u <strong>oponerte</strong> a su uso,
                    así como a revocar tu consentimiento. Para ejercerlos escríbenos a{" "}
                    <a href={mail} className={link}>contacto@schussler.com.mx</a> o llámanos al 55 4521 0178, indicando tu nombre, el correo con el que compraste
                    y qué derecho quieres ejercer. Te responderemos en un plazo máximo de 20 días hábiles.
                </p>
                <p>
                    Algunos datos de pedidos pueden conservarse el tiempo que la ley fiscal y contable lo exija, aun si solicitas su cancelación.
                </p>

                <h2 id="cookies" className={h2}>6. Cookies y almacenamiento local</h2>
                <p>
                    Usamos una cookie de sesión, necesaria para mantener tu cuenta iniciada, y el almacenamiento local de tu navegador para recordar el contenido de tu carrito.
                    No usamos cookies de publicidad. Si lo aceptas en el aviso de cookies, usamos además Google Analytics, que instala cookies para medir de forma estadística cómo se usa el sitio (páginas visitadas, tiempo de visita y origen aproximado); Google puede procesar esa información en servidores fuera de México. Si rechazas, no se carga. Puedes cambiar tu decisión en cualquier momento desde «Preferencias de cookies», al pie de la página.
                </p>

                <h2 className={h2}>7. Cambios a este aviso</h2>
                <p>
                    Publicaremos cualquier cambio en esta página, con su fecha de actualización. Consulta también nuestros{" "}
                    <Link href="/terminos" className={link}>términos y condiciones</Link> y la{" "}
                    <Link href="/devoluciones" className={link}>política de devoluciones</Link>.
                </p>
            </div>
        </div>
    )
}
