'use client'

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { createStaff, saveCategory } from "@/app/admin/actions"

const fieldClass = "h-10 rounded-md border border-[var(--border)] bg-transparent px-3 text-sm"

export function NewCategoryForm() {
    const [state, action, pending] = useActionState(saveCategory, undefined)
    return (
        <form action={action} className="flex flex-wrap items-start gap-2">
            <div>
                <label htmlFor="new-category" className="sr-only">Nueva categoría</label>
                <input id="new-category" name="name" required placeholder="Nueva categoría" className={fieldClass} />
                {state?.errors?.name && <p className="mt-1 text-xs text-red-500">{state.errors.name[0]}</p>}
                {state?.ok && <p className="mt-1 text-xs text-[var(--accent)]">{state.message}</p>}
            </div>
            <Button disabled={pending}>Agregar</Button>
        </form>
    )
}

export function NewStaffForm() {
    const [state, action, pending] = useActionState(createStaff, undefined)
    const err = (name: string) => state?.errors?.[name]?.[0]
    return (
        <form action={action} className="grid max-w-md gap-4">
            <div>
                <label htmlFor="staff-name" className="mb-1 block text-sm font-medium">Nombre</label>
                <input id="staff-name" name="name" required className={`${fieldClass} w-full`} />
                {err("name") && <p className="mt-1 text-xs text-red-500">{err("name")}</p>}
            </div>
            <div>
                <label htmlFor="staff-email" className="mb-1 block text-sm font-medium">Correo</label>
                <input id="staff-email" name="email" type="email" required className={`${fieldClass} w-full`} />
                {err("email") && <p className="mt-1 text-xs text-red-500">{err("email")}</p>}
            </div>
            <div>
                <label htmlFor="staff-password" className="mb-1 block text-sm font-medium">Contraseña inicial</label>
                <input id="staff-password" name="password" type="password" minLength={8} required autoComplete="new-password" className={`${fieldClass} w-full`} />
                {err("password") && <p className="mt-1 text-xs text-red-500">{err("password")}</p>}
            </div>
            {state?.ok && <p className="text-sm text-[var(--accent)]">{state.message}</p>}
            <Button disabled={pending} className="w-fit">Crear usuario</Button>
        </form>
    )
}
