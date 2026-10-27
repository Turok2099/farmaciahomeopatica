import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/jwt'

const protectedRoutes = ['/dashboard', '/admin']

export async function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))

    if (isProtectedRoute) {
        const cookie = request.cookies.get('session')?.value
        const session = cookie ? await decrypt(cookie) : null

        if (!session?.userId) {
            return NextResponse.redirect(new URL('/auth/login', request.nextUrl))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|webp|svg|ico)$).*)'],
}
