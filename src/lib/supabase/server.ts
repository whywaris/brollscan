import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { User, Session } from '@supabase/supabase-js'

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
    return { data: { user: mockUser as unknown as User }, error: null };
  };

  client.auth.getSession = async () => {
    return { data: { session: { user: mockUser as unknown as User, access_token: 'mock-token' } as unknown as Session }, error: null };
  };

  return client;
}
