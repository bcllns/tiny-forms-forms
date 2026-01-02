import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function signInWithOTP(email: string) {
  const supabase = createClient()
  
  // Normalize email
  const normalizedEmail = email.trim().toLowerCase()
  
  // Send OTP code (not magic link)
  const { data, error } = await supabase.auth.signInWithOtp({
    email: normalizedEmail,
    options: {
      shouldCreateUser: true,
      // Use email OTP instead of magic link
      emailRedirectTo: undefined,
    },
  })
  
  console.log('OTP request sent:', { email: normalizedEmail.substring(0, 3) + '***', error: error?.message });
  
  return { data, error }
}

export async function verifyOTP(email: string, token: string) {
  const supabase = createClient()
  
  // Trim token and normalize email
  const trimmedToken = token.trim()
  const normalizedEmail = email.trim().toLowerCase()
  
  const { data, error } = await supabase.auth.verifyOtp({
    email: normalizedEmail,
    token: trimmedToken,
    type: 'email',
  })
  
  return { data, error }
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getSession() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
