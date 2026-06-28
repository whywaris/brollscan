import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { searchBrollForScene } from '@/lib/stock-footage';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id: scriptId } = await params;

    let scenes: any[] = [];

    // Check if client passed the scenes directly (useful for local storage fallback)
    try {
      const body = await request.json();
      if (body && Array.isArray(body.scenes)) {
        scenes = body.scenes;
      }
    } catch {
      // Body empty or not JSON, proceed
    }

    // If no scenes in body, query database
    if (scenes.length === 0) {
      try {
        const { data: script } = await supabase
          .from('scripts')
          .select('id')
          .eq('id', scriptId)
          .single();

        if (script) {
          const { data: scenesData } = await supabase
            .from('scenes')
            .select('*')
            .eq('script_id', scriptId)
            .order('scene_order', { ascending: true });

          if (scenesData && scenesData.length > 0) {
            scenes = scenesData;
          }
        }
      } catch (err) {
        console.warn('Supabase fetch failed in find-broll, trying local fallback:', err);
      }
    }

    if (scenes.length === 0) {
      return NextResponse.json(
        { error: 'No scenes found for this script' },
        { status: 404 }
      );
    }

    // 4. Search B-roll for each scene and save results
    const groupedResults: Array<{
      scene: typeof scenes[0];
      results: Array<Record<string, unknown>>;
    }> = [];

    for (const scene of scenes) {
      const keywords: string[] = Array.isArray(scene.keywords)
        ? scene.keywords
        : [];

      // Search stock footage APIs
      const videoResults = await searchBrollForScene(keywords);

      // Save results to broll_results table
      if (videoResults.length > 0) {
        const brollInserts = videoResults.map((video) => ({
          scene_id: scene.id,
          source: video.source,
          thumbnail_url: video.thumbnail_url,
          video_url: video.video_url,
          duration_seconds: video.duration_seconds,
          relevance_score: video.relevance_score,
          external_id: video.external_id,
        }));

        let savedResults = null;
        try {
          const { data, error: brollError } = await supabase
            .from('broll_results')
            .insert(brollInserts)
            .select();
          if (brollError) throw brollError;
          savedResults = data;
        } catch (dbErr) {
          console.warn(
            `Failed to save B-roll results to database for scene ${scene.id}, using local fallback:`,
            dbErr
          );
          savedResults = brollInserts.map((bi) => ({
            id: crypto.randomUUID(),
            ...bi,
          }));
        }

        groupedResults.push({ scene, results: savedResults || [] });
      } else {
        groupedResults.push({ scene, results: [] });
      }
    }

    // 5. Return structured results grouped by scene
    return NextResponse.json({ scenes: groupedResults });
  } catch (error) {
    console.error('Find B-roll error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
