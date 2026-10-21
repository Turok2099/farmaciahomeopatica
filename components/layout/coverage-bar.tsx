import Link from "next/link"

export function CoverageBar() {
    return (
        <div className="bg-[var(--primary)] text-[var(--primary-foreground)]">
            <p className="container-custom py-2 text-center text-xs sm:text-sm">
                Venta y entregas en Ciudad de México · Envío gratis en compras superiores a $800.{" "}
                <Link href="/envios" className="font-medium underline underline-offset-2">Ver condiciones</Link>
            </p>
        </div>
    )
}
