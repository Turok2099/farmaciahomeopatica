
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session'

export async function middleware(request: NextRequest) {
    const protectedRoutes = ['/dashboard', '/carrito/checkout']
    const publicRoutes = ['/auth/login', '/auth/registro', '/']

    const path = request.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
    const isPublicRoute = publicRoutes.some(route => path === route)

    const cookie = request.cookies.get('session')?.value
    const session = cookie ? await decrypt(cookie) : null

    if (isProtectedRoute && !session?.userId) {
        return NextResponse.redirect(new URL('/auth/login', request.nextUrl))
    }

    if (isPublicRoute && session?.userId && !request.nextUrl.pathname.startsWith('/dashboard')) {
        // Optional: Redirect to dashboard if already logged in and visiting login/register
        // return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
