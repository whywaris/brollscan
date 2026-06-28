import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Can be ignored if middleware refreshes sessions
          }
        },
      },
    }
  )

  const mockUser = {
    id: '00000000-0000-0000-0000-000000000000',
    email: 'guest@brollscan.com',
    user_metadata: {},
    app_metadata: {},
    aud: 'authenticated',
    role: 'authenticated',
    created_at: new Date().toISOString(),
  };

  client.auth.getUser = async () => {
    return { data: { user: mockUser }, error: null } as any;
  };

  client.auth.getSession = async () => {
    return { data: { session: { user: mockUser, access_token: 'mock-token' } }, error: null } as any;
  };

  return client;
}
