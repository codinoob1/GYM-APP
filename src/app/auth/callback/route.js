import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  

  if (!next.startsWith('/')) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
  }

  if (code) {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && session?.user) {
      const targetPath = next && next !== '/' ? next : (session.user.user_metadata?.onboarding_completed ? '/dashboard' : '/onboarding')
      return NextResponse.redirect(`${origin}${targetPath}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
