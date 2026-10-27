# Homeopáticos Schüssler

Tienda en línea de productos homeopáticos y sales de Schüssler. Entrega a domicilio solo en la Ciudad de México, o recolección en sucursal. Dominio: <https://www.schussler.com.mx>.

## Stack

- Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript
- Base de datos: Neon (Postgres) con Drizzle ORM
- Pagos: Stripe Checkout (página alojada por Stripe) y webhook
- Imágenes: Cloudinary
- Correo transaccional: Resend
- Sesión: JWT en cookie `httpOnly` (`jose`) y contraseñas con `bcryptjs`

## Requisitos

- Node.js 20 o superior
- Una base de datos en Neon, y cuentas de Stripe, Cloudinary y Resend

## Puesta en marcha

```bash
npm install
# crea .env.local con las variables de la sección siguiente
npm run db:migrate           # crea las tablas
npm run seed                 # carga categorías y productos de ejemplo
npm run dev                  # http://localhost:3000
```

## Variables de entorno

Se definen en `.env.local` (no se sube al repositorio) y, en producción, en Vercel → Settings → Environment Variables. Después de cambiarlas en Vercel hay que volver a desplegar.

| Variable | Para qué sirve |
| --- | --- |
| `DATABASE_URL` | Cadena de conexión de Neon. |
| `JWT_SECRET` | Secreto para firmar las sesiones. Una cadena larga y aleatoria. |
| `SITE_URL` | URL pública, sin barra final. Producción: `https://www.schussler.com.mx`. En local: `http://localhost:3000`. Alimenta los enlaces de regreso de Stripe, el sitemap, los canonical y los correos. |
| `STRIPE_SECRET_KEY` | Clave secreta de Stripe (`sk_test_…` o `sk_live_…`). |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clave pública de Stripe. |
| `STRIPE_WEBHOOK_SECRET` | Secreto de firma del webhook (`whsec_…`). Sin él, los pedidos nunca pasan a pagados. |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Imágenes de producto y subida desde el panel. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número de WhatsApp en formato internacional, solo dígitos (por ejemplo `5215512345678`). |
| `RESEND_API_KEY` | Clave de Resend para enviar correos. |
| `EMAIL_FROM` | Remitente, con el dominio verificado en Resend. Ejemplo: `Homeopáticos Schüssler <pedidos@schussler.com.mx>`. |

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo. |
| `npm run build` / `npm start` | Compila y sirve la versión de producción. |
| `npm run lint` | ESLint. |
| `npm run seed` | Inserta categorías y productos de `scripts/seed-data.ts`. |
| `npm run make-admin -- correo@dominio.com` | Convierte una cuenta ya registrada en el administrador único. |
| `npm run db:generate` | Genera una migración a partir de los cambios en `lib/schema.ts`. |
| `npm run db:migrate` | Aplica las migraciones pendientes a la base de `DATABASE_URL`. |

## Base de datos y migraciones

El esquema está en `lib/schema.ts` y las migraciones en `drizzle/`.

1. Edita `lib/schema.ts`.
2. `npm run db:generate -- --name descripcion_corta` y revisa el SQL generado.
3. `npm run db:migrate`.

`DATABASE_URL` apunta a una sola base, así que migrar desde local afecta a esa misma base. Haz solo cambios aditivos o revisa el SQL antes de aplicarlo.

## Roles

- **admin**: único (lo garantiza un índice parcial). Gestiona productos, categorías, pedidos y usuarios.
- **staff**: solo activa o desactiva la disponibilidad de productos.
- **customer**: cliente con cuenta. También se puede comprar sin cuenta.

El panel está en `/admin` y se protege en `proxy.ts` y en cada página con `requireRole`.

## Pedidos y Stripe

1. El checkout crea el pedido como `pending` y redirige a Stripe Checkout. Los precios se leen siempre de la base, nunca del navegador.
2. Stripe llama a `POST /api/stripe/webhook` (firma verificada). Al pagarse, el pedido pasa a `paid`.
3. Al pasar a `paid` se envía el correo de confirmación con Resend. Se envía una sola vez; si falla, se reintenta al abrir `/checkout/exito`, y el administrador puede reenviarlo desde el detalle del pedido.

Eventos que debe tener el endpoint registrado en Stripe: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed` y `checkout.session.expired`.

Probar el webhook en local:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copia el `whsec_…` que imprime en `STRIPE_WEBHOOK_SECRET` de `.env.local`. Tarjeta de prueba: `4242 4242 4242 4242`.

## Seguridad

- **Límite de intentos** en inicio de sesión, registro y recuperación de contraseña, guardado en la tabla `rate_limits` (`lib/rate-limit.ts`).
- **Campo trampa** contra bots en los formularios de autenticación.
- **Recuperar contraseña:** enlace de un solo uso que vence en 1 hora. Solo se guarda el hash del token.
- **Cabeceras** (CSP, `X-Frame-Options`, HSTS, etc.) en `next.config.ts`. Si agregas un servicio externo (analítica, mapas, scripts de terceros), hay que permitir su dominio en la CSP.

## Estructura

```
app/            Rutas (tienda, auth, admin, api) y acciones del servidor
components/     Componentes de interfaz
lib/            Acceso a datos, pedidos, correo, sesión, SEO (site.ts)
drizzle/        Migraciones SQL
scripts/        Seed y utilidades de administración
public/         Logos, iconos e imágenes estáticas
```

## SEO

- Datos del negocio (dirección, horario, redes) en `lib/site.ts`: alimentan el JSON-LD de `Pharmacy`.
- `app/sitemap.ts` y `app/robots.ts` se generan solos a partir de `SITE_URL` y de los productos publicados.
- El horario de la sucursal vive en `lib/store-hours.ts`.

## Despliegue

El proyecto se despliega en Vercel. `www.schussler.com.mx` es el dominio canónico; el dominio sin `www` redirige a él. Antes de desplegar cambios de esquema, aplica la migración (`npm run db:migrate`).

Para pasar a cobros reales hay que cambiar a claves `live` de Stripe (secreta, pública y el secreto del webhook de modo live) y repetir una compra de prueba de punta a punta.
