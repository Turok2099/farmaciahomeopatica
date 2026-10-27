'use client'

import Image from "next/image"

// Las URLs de Cloudinary ya traen f_auto,q_auto y un ancho (w_600). Este loader pide a Cloudinary el ancho
// que necesita cada pantalla, sin pasar por el optimizador de Vercel. Debe estar en un componente cliente.
const cloudinaryLoader = ({ src, width }: { src: string; width: number }) =>
    src.includes("res.cloudinary.com") ? src.replace(/([,/])w_\d+/, `$1w_${width}`) : src

interface CloudinaryImageProps {
    src: string
    alt: string
    sizes: string
    priority?: boolean
    className?: string
}

// Rellena a su contenedor, que debe tener position: relative y un tamaño definido.
export function CloudinaryImage({ src, alt, sizes, priority, className }: CloudinaryImageProps) {
    return <Image loader={cloudinaryLoader} src={src} alt={alt} fill sizes={sizes} priority={priority} className={className} />
}
