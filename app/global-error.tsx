'use client'

// Último recurso: reemplaza al layout raíz, por eso lleva sus propias etiquetas html y body y estilos en línea.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    console.error(error)

    return (
        <html lang="es-MX">
            <body style={{ fontFamily: "system-ui, sans-serif", textAlign: "center", padding: "6rem 1rem", color: "#172b3a" }}>
                <h1 style={{ fontSize: "1.875rem", marginBottom: "0.5rem" }}>Algo salió mal</h1>
                <p style={{ marginBottom: "2rem", color: "#5b6b78" }}>No pudimos cargar el sitio. Inténtalo de nuevo en unos momentos.</p>
                <button
                    onClick={reset}
                    style={{ background: "#014c80", color: "#fff", border: 0, borderRadius: 6, padding: "0.625rem 1.5rem", fontSize: "0.875rem", cursor: "pointer" }}
                >
                    Reintentar
                </button>
                {error.digest && <p style={{ marginTop: "2rem", fontSize: "0.75rem", color: "#5b6b78" }}>Código: {error.digest}</p>}
            </body>
        </html>
    )
}
