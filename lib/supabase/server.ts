import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `cookies().set()` method can only be called in a Server Component or Route Handler
            // that is part of a React Server Components request. If you are trying to set cookies in a
            // Client Component, it's recommended to instead use a Server Action with `cookies()`
            // or a Route Handler that sets the cookies. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#cookiesset(name,-value,-options)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `cookies().set()` method can only be called in a Server Component or Route Handler
            // that is part of a React Server Components request. If you are trying to set cookies in a
            // Client Component, it's recommended to instead use a Server Action with `cookies()`
            // or a Route Handler that sets the cookies. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#cookiesset(name,-value,-options)
          }
        },
      },
    }
  )
}
