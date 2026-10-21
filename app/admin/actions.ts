'use server'

import { hash } from 'bcryptjs'
import { and, count, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { db } from '@/lib/db'
import { categories, orders, products, users } from '@/lib/schema'
import { requireRole } from '@/lib/auth'
import { signUpload } from '@/lib/cloudinary'

export type AdminState = { ok?: boolean; message?: string; errors?: Record<string, string[]> } | undefined

const refreshStore = () => revalidatePath('/', 'layout')

const slugify = (value: string) =>
    value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

// ---- Disponibilidad: admin y staff ----------------------------------------

export async function toggleAvailability(formData: FormData) {
    await requireRole('admin', 'staff')
    const id = Number(formData.get('id'))
    if (!Number.isInteger(id)) return
    const [product] = await db.select({ available: products.available }).from(products).where(eq(products.id, id))
    if (!product) return
    await db.update(products).set({ available: !product.available, updatedAt: new Date() }).where(eq(products.id, id))
    refreshStore()
    revalidatePath('/admin/productos')
}

// ---- Productos: solo admin --------------------------------------------------

const ProductSchema = z.object({
    name: z.string().trim().min(2, 'El nombre es obligatorio.').max(120),
    slug: z.string().trim().max(120).optional(),
    price: z.coerce.number({ message: 'Precio inválido.' }).min(0, 'Precio inválido.').max(1_000_000),
    categoryId: z.coerce.number().int('Elige una categoría.'),
    presentation: z.string().trim().max(60).default(''),
    description: z.string().trim().max(2000).default(''),
    imageId: z.string().trim().max(200).regex(/^[\w\-./]*$/, 'ID de imagen inválido.').default(''),
})

export async function saveProduct(prev: AdminState, formData: FormData): Promise<AdminState> {
    await requireRole('admin')

    const rawId = formData.get('id')
    const id = rawId ? Number(rawId) : null

    const parsed = ProductSchema.safeParse({
        name: formData.get('name'),
        slug: formData.get('slug') ?? undefined,
        price: formData.get('price'),
        categoryId: formData.get('categoryId'),
        presentation: formData.get('presentation') ?? '',
        description: formData.get('description') ?? '',
        imageId: formData.get('imageId') ?? '',
    })
    if (!parsed.success) return { errors: z.flattenError(parsed.error).fieldErrors }

    const data = parsed.data
    const base = {
        name: data.name,
        priceCents: Math.round(data.price * 100),
        categoryId: data.categoryId,
        presentation: data.presentation,
        description: data.description,
        imageId: data.imageId,
        available: formData.get('available') === 'on',
        published: formData.get('published') === 'on',
        featured: formData.get('featured') === 'on',
        updatedAt: new Date(),
    }

    if (id) {
        await db.update(products).set(base).where(eq(products.id, id))
    } else {
        const slug = slugify(data.slug || data.name)
        if (!slug) return { errors: { slug: ['No se pudo generar la dirección (slug).'] } }
        const [taken] = await db.select({ id: products.id }).from(products).where(eq(products.slug, slug))
        if (taken) return { errors: { slug: ['Ya existe un producto con esa dirección (slug).'] } }
        await db.insert(products).values({ ...base, slug })
    }

    refreshStore()
    redirect('/admin/productos')
}

export async function deleteProduct(formData: FormData) {
    await requireRole('admin')
    const id = Number(formData.get('id'))
    if (!Number.isInteger(id)) return
    await db.delete(products).where(eq(products.id, id))
    refreshStore()
    redirect('/admin/productos')
}

// ---- Fotos (Cloudinary): solo admin -----------------------------------------

export async function getUploadSignature() {
    await requireRole('admin')
    return signUpload()
}

// ---- Categorías: solo admin -------------------------------------------------

export async function saveCategory(prev: AdminState, formData: FormData): Promise<AdminState> {
    await requireRole('admin')
    const name = String(formData.get('name') ?? '').trim()
    if (name.length < 2 || name.length > 60) return { errors: { name: ['Escribe un nombre de 2 a 60 caracteres.'] } }
    const slug = slugify(name)
    const [exists] = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, slug))
    if (exists) return { errors: { name: ['Esa categoría ya existe.'] } }
    await db.insert(categories).values({ name, slug })
    refreshStore()
    revalidatePath('/admin/categorias')
    return { ok: true, message: 'Categoría creada.' }
}

export async function renameCategory(formData: FormData) {
    await requireRole('admin')
    const id = Number(formData.get('id'))
    const name = String(formData.get('name') ?? '').trim()
    if (!Number.isInteger(id) || name.length < 2 || name.length > 60) return
    await db.update(categories).set({ name, slug: slugify(name) }).where(eq(categories.id, id))
    refreshStore()
    revalidatePath('/admin/categorias')
}

export async function deleteCategory(formData: FormData) {
    await requireRole('admin')
    const id = Number(formData.get('id'))
    if (!Number.isInteger(id)) return
    const [{ total }] = await db.select({ total: count() }).from(products).where(eq(products.categoryId, id))
    if (total > 0) return // con productos no se elimina
    await db.delete(categories).where(eq(categories.id, id))
    refreshStore()
    revalidatePath('/admin/categorias')
}

// ---- Usuarios del panel (staff): solo admin ---------------------------------

const StaffSchema = z.object({
    name: z.string().trim().min(2, 'El nombre es obligatorio.'),
    email: z.string().trim().toLowerCase().pipe(z.email('Correo inválido.')),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.'),
})

export async function createStaff(prev: AdminState, formData: FormData): Promise<AdminState> {
    await requireRole('admin')
    const parsed = StaffSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    })
    if (!parsed.success) return { errors: z.flattenError(parsed.error).fieldErrors }

    const { name, email, password } = parsed.data
    const [exists] = await db.select({ id: users.id }).from(users).where(eq(users.email, email))
    if (exists) return { errors: { email: ['Ya existe una cuenta con ese correo.'] } }

    await db.insert(users).values({ name, email, password: await hash(password, 10), role: 'staff' })
    revalidatePath('/admin/usuarios')
    return { ok: true, message: `Usuario creado: ${email}. Comparte la contraseña por un medio seguro.` }
}

export async function deleteStaff(formData: FormData) {
    await requireRole('admin')
    const id = Number(formData.get('id'))
    if (!Number.isInteger(id)) return
    // Solo se pueden eliminar usuarios staff; el admin y los clientes no se tocan desde aquí.
    await db.delete(users).where(and(eq(users.id, id), eq(users.role, 'staff')))
    revalidatePath('/admin/usuarios')
}

// ---- Pedidos: solo admin ----------------------------------------------------

export async function updateOrderStatus(formData: FormData) {
    await requireRole('admin')
    const id = Number(formData.get('id'))
    const status = String(formData.get('status'))
    if (!Number.isInteger(id)) return
    const [order] = await db.select({ status: orders.status }).from(orders).where(eq(orders.id, id))
    if (!order) return

    // Transiciones permitidas: paid -> delivered; pending/paid -> cancelled.
    const allowed =
        (status === 'delivered' && order.status === 'paid') ||
        (status === 'cancelled' && (order.status === 'pending' || order.status === 'paid'))
    if (!allowed) return

    await db.update(orders).set({ status: status as 'delivered' | 'cancelled' }).where(eq(orders.id, id))
    revalidatePath('/admin/pedidos')
    revalidatePath(`/admin/pedidos/${id}`)
}
