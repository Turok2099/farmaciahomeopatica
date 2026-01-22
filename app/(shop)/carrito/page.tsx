import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const metadata = {
    title: "Carrito de Compras | Medicamento Homeopáticos Schussler",
}

export default function CartPage() {
    return (
        <div className="container-custom py-10">
            <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>

            <div className="flex flex-col items-center justify-center py-16 border border-dashed border-[var(--border)] rounded-lg bg-[var(--muted)]/20">
                <div className="mb-4 text-[var(--muted-foreground)]">
                    Tu carrito está vacío
                </div>
                <Link href="/productos">
                    <Button>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Explorar Productos
                    </Button>
                </Link>
            </div>

            {/* 
        TODO: Add cart items list and summary component here.
        This is a placeholder for the basic structure.
      */}
        </div>
    )
}
