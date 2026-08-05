import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Lazy getter for build-time safety
export const getSupabaseClient = () => {
  if (typeof window === 'undefined') {
    // During SSR/build, return a mock that won't be used
    return {} as ReturnType<typeof createBrowserClient>
  }
  return createClient()
}
