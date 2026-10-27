export default function Loading() {
    return (
        <div className="container-custom py-10" role="status" aria-live="polite">
            <span className="sr-only">Cargando productos…</span>
            <div className="mb-2 h-9 w-64 animate-pulse rounded-md bg-[var(--muted)]" />
            <div className="mb-8 h-4 w-80 max-w-full animate-pulse rounded bg-[var(--muted)]" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="overflow-hidden rounded-lg border border-[var(--border)]">
                        <div className="aspect-square animate-pulse bg-[var(--muted)]" />
                        <div className="space-y-2 p-4">
                            <div className="h-3 w-1/3 animate-pulse rounded bg-[var(--muted)]" />
                            <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--muted)]" />
                            <div className="h-5 w-1/4 animate-pulse rounded bg-[var(--muted)]" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
