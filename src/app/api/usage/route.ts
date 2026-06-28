import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUsage } from '@/lib/usage';

export async function GET() {
  try {
    // 1. Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Get usage data
    const usage = await getUsage(user.id);

    // 3. Return usage object
    return NextResponse.json(usage);
  } catch (error) {
    console.error('Usage fetch error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
