import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="container-custom flex flex-col items-center py-24 text-center">
            <h1 className="mb-2 text-3xl font-bold">Página no encontrada</h1>
            <p className="mb-8 text-[var(--muted-foreground)]">La página que buscas no existe o fue movida.</p>
            <Link href="/productos">
                <Button>Ver productos</Button>
            </Link>
        </div>
    )
}
