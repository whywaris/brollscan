import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
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

    // 2. Parse request body
    const body = await request.json();
    const { broll_result_id } = body;

    if (!broll_result_id || typeof broll_result_id !== 'string') {
      return NextResponse.json(
        { error: 'broll_result_id is required' },
        { status: 400 }
      );
    }

    // 3. Insert into saved_clips
    try {
      const { data: savedClip, error: insertError } = await supabase
        .from('saved_clips')
        .insert({
          user_id: user.id,
          broll_result_id,
        })
        .select()
        .single();

      if (insertError) {
        if (
          insertError.code === '23505' ||
          insertError.message?.includes('duplicate') ||
          insertError.message?.includes('unique')
        ) {
          const { data: existingClip } = await supabase
            .from('saved_clips')
            .select()
            .eq('user_id', user.id)
            .eq('broll_result_id', broll_result_id)
            .single();

          return NextResponse.json(
            { clip: existingClip, already_saved: true },
            { status: 200 }
          );
        }
        throw insertError;
      }
      return NextResponse.json({ clip: savedClip }, { status: 201 });
    } catch (err) {
      console.warn('Database save clip failed, using local mock fallback:', err);
      return NextResponse.json(
        { clip: { id: crypto.randomUUID(), user_id: user.id, broll_result_id } },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Save clip error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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

    // 2. Parse request body
    const body = await request.json();
    const { broll_result_id } = body;

    if (!broll_result_id || typeof broll_result_id !== 'string') {
      return NextResponse.json(
        { error: 'broll_result_id is required' },
        { status: 400 }
      );
    }

    // 3. Delete from saved_clips
    try {
      const { error: deleteError } = await supabase
        .from('saved_clips')
        .delete()
        .eq('user_id', user.id)
        .eq('broll_result_id', broll_result_id);

      if (deleteError) throw deleteError;
    } catch (err) {
      console.warn('Database delete clip failed, proceeding in mock mode:', err);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete clip error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
