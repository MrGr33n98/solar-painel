import { createMiddlewareClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

import type { NextRequest } from 'next/server'

const prisma = new PrismaClient()

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let dbUserRole: string | null = null
  if (user) {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })
    dbUserRole = dbUser?.role || null
  }

  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isVendorRoute = req.nextUrl.pathname.startsWith('/vendor')
  const isLoginRoute = req.nextUrl.pathname === '/login'

  // Redirecionar usuários não autenticados de rotas protegidas para o login
  if (!user && (isAdminRoute || isVendorRoute)) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Redirecionar usuários autenticados da página de login para o dashboard apropriado
  if (user && isLoginRoute) {
    if (dbUserRole === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    } else if (dbUserRole === 'VENDOR') {
      return NextResponse.redirect(new URL('/vendor/dashboard', req.url))
    } else if (dbUserRole === 'BUYER') {
      return NextResponse.redirect(new URL('/buyer/marketplace', req.url))
    }
    // Fallback para qualquer outro usuário autenticado
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Proteção de rotas baseada em papéis
  if (user) {
    if (isAdminRoute && dbUserRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', req.url)) // Ou para o dashboard do usuário
    }
    if (isVendorRoute && dbUserRole !== 'VENDOR') {
      return NextResponse.redirect(new URL('/unauthorized', req.url)) // Ou para o dashboard do usuário
    }
    // Para rotas de comprador, assumimos que qualquer usuário autenticado pode acessar por enquanto
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*', '/vendor/:path*', '/login'], // Aplica o middleware a rotas de admin, vendor e login
}
