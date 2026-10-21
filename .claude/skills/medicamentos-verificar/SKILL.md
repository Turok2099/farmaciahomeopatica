---
name: medicamentos-verificar
description: Revisar un diff o ejecutar verificaciones solicitadas para medicamentosh. No activar por cada edición menor.
---

Ejecuta npm desde medicamentosh/, donde está package.json; la carpeta externa solo tiene un lockfile.

Elige controles por alcance:
- Instrucciones: formato, rutas y coherencia; no compiles la aplicación.
- Código: lint y compilación cuando corresponda. Scripts existentes: npm run lint y npm run build; no hay script test inicial.
- Interacción: verifica únicamente el recorrido afectado con npm run dev, si puedes usar navegador.

No repitas controles que ya pasaron sin cambios nuevos. Instala dependencias solo si faltan. Si falla el entorno, identifica el bloqueo sin fabricar DATABASE_URL o JWT_SECRET ni mostrar secretos.

Separa regresiones de problemas previos. Entrega hallazgos con archivo y ubicación, controles ejecutados y límites; no extiendas la revisión al proyecto completo salvo petición.
