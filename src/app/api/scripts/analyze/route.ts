import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeScript } from '@/lib/claude';
import { checkUsageLimit, incrementUsage } from '@/lib/usage';
import { AnalyzeRequest } from '@/types';

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

    // 2. Check usage limit
    const canAnalyze = await checkUsageLimit(user.id);
    if (!canAnalyze) {
      return NextResponse.json(
        { error: 'Usage limit reached', upgrade: true },
        { status: 402 }
      );
    }

    // 3. Parse request body
    const body: AnalyzeRequest = await request.json();
    const { text, title } = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Script text is required' },
        { status: 400 }
      );
    }

    // 4. Call Claude to analyze the script
    const analyzedScenes = await analyzeScript(text);

    // 5. Save script to DB
    // 5. Save script to DB
    let script = null;
    let scenes = null;

    try {
      const { data, error: scriptError } = await supabase
        .from('scripts')
        .insert({
          user_id: user.id,
          title: title || null,
          raw_text: text,
          scene_count: analyzedScenes.length,
        })
        .select()
        .single();

      if (scriptError || !data) {
        throw new Error(scriptError?.message || 'Script save returned no data');
      }
      script = data;

      // 6. Save each scene to DB
      const sceneInserts = analyzedScenes.map((scene) => ({
        script_id: script.id,
        scene_order: scene.scene_order,
        text_content: scene.text_content,
        keywords: scene.keywords,
        scene_title: scene.scene_title || null,
      }));

      const { data: scenesData, error: scenesError } = await supabase
        .from('scenes')
        .insert(sceneInserts)
        .select();

      if (scenesError || !scenesData) {
        throw new Error(scenesError?.message || 'Scenes save returned no data');
      }
      scenes = scenesData;
    } catch (dbError) {
      console.warn('Database save failed, using local fallback:', dbError);
      
      const generatedScriptId = crypto.randomUUID();
      script = {
        id: generatedScriptId,
        user_id: user.id,
        title: title || 'Untitled Script',
        raw_text: text,
        scene_count: analyzedScenes.length,
        created_at: new Date().toISOString(),
      };

      scenes = analyzedScenes.map((scene) => ({
        id: crypto.randomUUID(),
        script_id: generatedScriptId,
        scene_order: scene.scene_order,
        text_content: scene.text_content,
        keywords: scene.keywords,
        scene_title: scene.scene_title || null,
      }));
    }

    // 7. Increment usage (swallowed if it fails/does nothing)
    try {
      await incrementUsage(user.id);
    } catch {
      // ignore
    }

    // 8. Return results
    return NextResponse.json({ script, scenes });
  } catch (error) {
    console.error('Script analysis error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
