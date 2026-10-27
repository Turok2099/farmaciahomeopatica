import { INSTAGRAM_URL, FACEBOOK_URL } from "@/components/shop/social-links"

export const SITE_NAME = "Homeopáticos Schüssler"
export const SITE_DESCRIPTION =
    "Tienda de productos homeopáticos y sales de Schüssler en la Ciudad de México. Entrega a domicilio en CDMX o recoge en sucursal en la Condesa."
export const DEFAULT_OG_IMAGE = "/images/portada-homeopaticos-schussler.png"

// URL pública del sitio. Sin barra final.
export const SITE_URL = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "")

export const SOCIAL_PROFILES = [INSTAGRAM_URL, FACEBOOK_URL]

// Mismo NAP (nombre, dirección) que Google Business Profile.
export const ADDRESS = {
    "@type": "PostalAddress",
    streetAddress: "Alfonso Reyes 234, Col. Condesa",
    addressLocality: "Ciudad de México",
    addressRegion: "CDMX",
    postalCode: "06140",
    addressCountry: "MX",
} as const

export const GEO = { "@type": "GeoCoordinates", latitude: 19.406915, longitude: -99.172855 } as const

export const OPENING_HOURS = [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "10:00", closes: "18:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "10:00", closes: "17:00" },
]
