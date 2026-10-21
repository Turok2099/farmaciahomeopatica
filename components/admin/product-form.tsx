'use client'

import { useActionState, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getUploadSignature, saveProduct } from "@/app/admin/actions"

export interface ProductFormValues {
    id?: number
    name: string
    slug: string
    price: string
    categoryId: number | ""
    presentation: string
    description: string
    imageId: string
    available: boolean
    published: boolean
    featured: boolean
}

const fieldClass = "w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm"

export function ProductForm({
    values,
    categories,
    cloudName,
}: {
    values: ProductFormValues
    categories: { id: number; name: string }[]
    cloudName: string
}) {
    const [state, action, pending] = useActionState(saveProduct, undefined)
    const [imageId, setImageId] = useState(values.imageId)
    const [uploading, setUploading] = useState(false)
    const [uploadError, setUploadError] = useState("")
    const isEdit = Boolean(values.id)

    async function onFile(file: File | undefined) {
        if (!file) return
        setUploading(true)
        setUploadError("")
        try {
            const sig = await getUploadSignature()
            const body = new FormData()
            body.set("file", file)
            body.set("api_key", sig.apiKey)
            body.set("timestamp", String(sig.timestamp))
            body.set("folder", sig.folder)
            body.set("signature", sig.signature)
            const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloud}/image/upload`, { method: "POST", body })
            const json = await res.json()
            if (!res.ok) throw new Error(json?.error?.message ?? "No se pudo subir la imagen.")
            setImageId(json.public_id)
        } catch (error) {
            setUploadError(error instanceof Error ? error.message : "No se pudo subir la imagen.")
        } finally {
            setUploading(false)
        }
    }

    const err = (name: string) => state?.errors?.[name]?.[0]

    return (
        <form action={action} className="grid max-w-3xl gap-5">
            {values.id && <input type="hidden" name="id" value={values.id} />}
            <input type="hidden" name="imageId" value={imageId} />

            <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium">Nombre</label>
                <input id="name" name="name" defaultValue={values.name} required className={fieldClass} />
                {err("name") && <p className="mt-1 text-xs text-red-500">{err("name")}</p>}
            </div>

            <div>
                <label htmlFor="slug" className="mb-1 block text-sm font-medium">Dirección web (slug)</label>
                <input
                    id="slug"
                    name="slug"
                    defaultValue={values.slug}
                    readOnly={isEdit}
                    placeholder="Se genera del nombre si lo dejas vacío"
                    className={`${fieldClass} ${isEdit ? "bg-[var(--muted)]" : ""}`}
                />
                {isEdit && <p className="mt-1 text-xs text-[var(--muted-foreground)]">No se puede cambiar para no romper enlaces.</p>}
                {err("slug") && <p className="mt-1 text-xs text-red-500">{err("slug")}</p>}
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
                <div>
                    <label htmlFor="price" className="mb-1 block text-sm font-medium">Precio (MXN)</label>
                    <input id="price" name="price" type="number" step="0.01" min="0" defaultValue={values.price} required className={fieldClass} />
                    {err("price") && <p className="mt-1 text-xs text-red-500">{err("price")}</p>}
                </div>
                <div>
                    <label htmlFor="categoryId" className="mb-1 block text-sm font-medium">Categoría</label>
                    <select id="categoryId" name="categoryId" defaultValue={values.categoryId} required className={fieldClass}>
                        <option value="" disabled>Elegir…</option>
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    {err("categoryId") && <p className="mt-1 text-xs text-red-500">{err("categoryId")}</p>}
                </div>
                <div>
                    <label htmlFor="presentation" className="mb-1 block text-sm font-medium">Presentación</label>
                    <input id="presentation" name="presentation" defaultValue={values.presentation} placeholder="250 ml, 60 g…" className={fieldClass} />
                </div>
            </div>

            <div>
                <label htmlFor="description" className="mb-1 block text-sm font-medium">Descripción</label>
                <textarea id="description" name="description" rows={4} defaultValue={values.description} className={fieldClass} />
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">Opcional. Usa solo información verificada del fabricante.</p>
            </div>

            <div>
                <span className="mb-1 block text-sm font-medium">Foto</span>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-md border border-[var(--border)] bg-white text-xs text-[var(--muted-foreground)]">
                        {imageId && cloudName ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={`https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_240/${imageId}`} alt="Vista previa" className="h-full w-full object-contain" />
                        ) : "Sin foto"}
                    </div>
                    <div className="space-y-2">
                        <input type="file" accept="image/*" disabled={uploading} onChange={(e) => onFile(e.target.files?.[0])} className="block text-sm" />
                        {uploading && <p className="text-xs text-[var(--muted-foreground)]">Subiendo…</p>}
                        {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
                        {imageId && (
                            <button type="button" onClick={() => setImageId("")} className="text-xs text-[var(--primary)] hover:underline">Quitar foto</button>
                        )}
                    </div>
                </div>
            </div>

            <fieldset className="flex flex-wrap gap-6 text-sm">
                <legend className="sr-only">Estado</legend>
                <label className="flex items-center gap-2"><input type="checkbox" name="available" defaultChecked={values.available} /> Disponible</label>
                <label className="flex items-center gap-2"><input type="checkbox" name="published" defaultChecked={values.published} /> Visible en la tienda</label>
                <label className="flex items-center gap-2"><input type="checkbox" name="featured" defaultChecked={values.featured} /> Destacado en el inicio</label>
            </fieldset>

            {state?.message && <p className="text-sm text-red-500">{state.message}</p>}

            <div className="flex gap-3">
                <Button disabled={pending || uploading}>{pending ? "Guardando…" : "Guardar"}</Button>
                <Link href="/admin/productos"><Button type="button" variant="outline">Cancelar</Button></Link>
            </div>
        </form>
    )
}
