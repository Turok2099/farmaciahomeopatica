---
name: medicamentos-catalogo
description: Modificar datos de productos, filtros, cantidades o estado del carrito de medicamentosh.
---

Rutas relativas a medicamentosh/:
- lib/data.ts: Product y products son la fuente actual. Conserva ids y slugs existentes; deriva filtros de categorías reales.
- app/(shop)/productos/page.tsx y productos/[slug]/page.tsx: listado y detalle.
- components/shop/product-card.tsx y app/(shop)/carrito/page.tsx: tarjeta y carrito.

En la revisión inicial filtros, cantidades y botones Agregar eran maquetas y el carrito siempre estaba vacío. Confirma únicamente lo que afecte al encargo. No presupongas tablas de productos o pedidos: el esquema inicial solo define users.

Si implementas carrito, comparte estado entre sus puntos de entrada y valida cantidades, disponibilidad y subtotal. Para pedidos, verifica precios en servidor. No añadas pagos por iniciativa propia ni deduzcas moneda del símbolo $. No inventes propiedades terapéuticas o dosis.

Verifica las operaciones modificadas y sus estados vacíos o inválidos.
