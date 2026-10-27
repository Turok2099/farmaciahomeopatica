import type { MetadataRoute } from "next"
import { SITE_NAME } from "@/lib/site"

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: SITE_NAME,
        short_name: "Schüssler",
        description: "Productos homeopáticos y sales de Schüssler en la Ciudad de México.",
        start_url: "/",
        display: "standalone",
        lang: "es-MX",
        background_color: "#ffffff",
        theme_color: "#014c80",
        icons: [
            { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
            { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },        ],
    }
}
