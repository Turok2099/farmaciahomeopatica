---
name: medicamentos-auth-db
description: Cambiar autenticación, sesiones JWT o persistencia Neon/Drizzle de medicamentosh.
---

Rutas relativas a medicamentosh/: lib/schema.ts y lib/db.ts para datos; lib/session.ts, app/actions/auth.ts y middleware.ts para autenticación. Lee solo las necesarias.

Neon usa drizzle-orm/neon-http y DATABASE_URL. Drizzle carga .env.local; esquema en lib/schema.ts y migraciones en drizzle/. El esquema inicial solo define users. Registro/login usan Zod y bcryptjs; redirect debe quedar fuera de capturas genéricas.

Sesión: jose HS256, cookie session, siete días y cookies() asíncrono. Al tocar esta área, verifica los problemas inicialmente observados: fallback fijo de JWT_SECRET, decrypt sin captura en middleware e importación desde un módulo que también usa next/headers. Revisa secure=true según el entorno. No perpetúes el secreto de respaldo.

Protección inicial: /dashboard y /carrito/checkout; comprueba autorización en operaciones sensibles. No muestres credenciales. Prepara migraciones sin aplicarlas a una base remota fuera de la autorización del encargo.

Prueba los casos de autenticación afectados, incluidos tokens inválidos si modificas sesiones; usa una base de desarrollo autorizada.
