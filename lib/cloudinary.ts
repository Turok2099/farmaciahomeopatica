import { createHash } from "node:crypto";

export const IMAGE_FOLDER = "productos";

// URL optimizada (formato y calidad automáticos). Vacío si el producto aún no tiene foto.
export function imageUrl(imageId: string, width = 600) {
    const cloud = process.env.CLOUDINARY_CLOUD_NAME;
    if (!imageId || !cloud) return "";
    return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto,w_${width}/${imageId}`;
}

// Firma una subida directa desde el navegador (el secreto nunca sale del servidor).
export function signUpload() {
    const cloud = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const secret = process.env.CLOUDINARY_API_SECRET;
    if (!cloud || !apiKey || !secret) throw new Error("Faltan variables de Cloudinary.");

    const timestamp = Math.round(Date.now() / 1000);
    const toSign = `folder=${IMAGE_FOLDER}&timestamp=${timestamp}`;
    const signature = createHash("sha1").update(toSign + secret).digest("hex");
    return { cloud, apiKey, timestamp, folder: IMAGE_FOLDER, signature };
}
