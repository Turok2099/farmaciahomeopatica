---
name: medicamentos-seo
description: Trabajar SEO de medicamentosh cuando se soliciten metadata, indexación, sitemap o datos estructurados.
---

Trabaja en medicamentosh/. Usa Metadata API en servidor; para productos consulta lib/data.ts y app/(shop)/productos/[slug]/page.tsx, donde params es asíncrono.

Según el encargo:
- Metadata: títulos y descripciones específicos; canonical y metadataBase solo con dominio real confirmado.
- Sitemap/robots: incluye rutas públicas existentes; excluye cuenta, autenticación y carrito del sitemap. Para impedir indexación usa noindex: robots.txt por sí solo no lo garantiza y bloquear rastreo puede impedir leer noindex.
- JSON-LD: representa datos reales. Confirma moneda antes de priceCurrency; no inventes reseñas, certificaciones ni afirmaciones médicas.

Conserva slugs; si deben cambiar, prepara redirecciones. Verifica HTML, respuestas o archivos generados que hayas modificado. No conviertas un cambio de metadata en una auditoría de rendimiento o reescritura del catálogo.
