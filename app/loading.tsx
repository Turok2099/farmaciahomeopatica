export default function Loading() {
    return (
        <div className="container-custom py-10" role="status" aria-live="polite">
            <span className="sr-only">Cargando…</span>
            <div className="mb-6 h-9 w-64 animate-pulse rounded-md bg-[var(--muted)]" />
            <div className="space-y-3">
                <div className="h-4 w-full max-w-xl animate-pulse rounded bg-[var(--muted)]" />
                <div className="h-4 w-full max-w-lg animate-pulse rounded bg-[var(--muted)]" />
                <div className="h-4 w-full max-w-md animate-pulse rounded bg-[var(--muted)]" />
            </div>
        </div>
    )
}
