import { createMiddlewareClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Se o usuário não estiver logado e tentar acessar uma rota de admin, redirecione para o login
  if (!user && req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Se o usuário estiver logado e tentar acessar a página de login, redirecione para o dashboard de admin
  if (user && req.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*', '/login'], // Aplica o middleware a todas as rotas /admin e à rota /login
}
