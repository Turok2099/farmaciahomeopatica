---
name: medicamentos-ui
description: Ajustar estilos y componentes visuales de medicamentosh. Para análisis de recorridos usar medicamentos-ux.
---

La aplicación está en medicamentosh/. Usa Next.js App Router, React, TypeScript y Tailwind 4; @/ apunta a su raíz.

- Reutiliza colores, tema oscuro y container-custom de app/globals.css; Button de components/ui/button.tsx y componentes de components/layout/.
- Conserva español e identidad verde salvo petición de rediseño. Tarjetas: components/shop/product-card.tsx.
- Mantén metadata en servidor; añade componentes cliente solo donde haya interacción. En detalle de producto params es asíncrono.
- Cloudinary está autorizado en next.config.ts. Comprueba móvil, escritorio, teclado y contraste solo en lo afectado.

Lee únicamente los archivos necesarios para el cambio; no inicies auditorías de UX o SEO por un ajuste visual.
