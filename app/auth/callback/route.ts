import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Restrict to UMak emails only
      if (!data.user.email?.endsWith('@umak.edu.ph')) {
        await supabase.auth.signOut()
        return NextResponse.redirect(
          new URL('/login?error=Only+UMak+email+addresses+(@umak.edu.ph)+are+allowed', requestUrl.origin)
        )
      }
      // Check if profile exists, if not create one
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single()

      if (!existingProfile) {
        // Extract username from email (e.g. jdiaz from jdiaz.a12240995@umak.edu)
        const email = data.user.email || ''
        const emailPrefix = email.split('@')[0] // e.g. "jdiaz.a12240995"
        const username = emailPrefix.split('.')[0] // e.g. "jdiaz"

        // Capitalize first letter
        const displayName = data.user.user_metadata?.full_name
          || data.user.user_metadata?.name
          || username.charAt(0).toUpperCase() + username.slice(1)

        await supabase.from('profiles').insert({
          id: data.user.id,
          email: email,
          full_name: displayName,
          role: 'user',
        })
      }

      // Check role to determine redirect
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      const redirectPath = profile?.role === 'admin' ? '/dashboard' : '/'
      return NextResponse.redirect(new URL(redirectPath, requestUrl.origin))
    }
  }

  return NextResponse.redirect(new URL('/login?error=auth-failed', requestUrl.origin))
}
