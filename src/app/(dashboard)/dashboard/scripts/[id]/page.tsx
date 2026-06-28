'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Scene, BrollResult } from '@/types';

interface SceneWithResults extends Scene {
  results: BrollResult[];
}

export default function ScriptResultsPage() {
  const params = useParams();
  const scriptId = params.id as string;
  const [scriptTitle, setScriptTitle] = useState('');
  const [scenes, setScenes] = useState<SceneWithResults[]>([]);
  const [loading, setLoading] = useState(true);
  const [findingBroll, setFindingBroll] = useState(false);
  const [brollLoaded, setBrollLoaded] = useState(false);
  const [savedClips, setSavedClips] = useState<Set<string>>(new Set());
  const [activeScene, setActiveScene] = useState(0);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [error, setError] = useState('');
  const sceneRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    loadScript();
  }, [scriptId]);

  async function loadScript() {
    const supabase = createClient();
    let loadedScript = null;
    let loadedScenes = [];

    // Try Supabase first
    try {
      const { data: script } = await supabase
        .from('scripts')
        .select('*')
        .eq('id', scriptId)
        .single();
      loadedScript = script;

      const { data: scenesData } = await supabase
        .from('scenes')
        .select('*')
        .eq('script_id', scriptId)
        .order('scene_order');
      loadedScenes = scenesData || [];
    } catch {
      // ignore
    }

    // Fallback to localStorage if Supabase failed or returned nothing
    if (!loadedScript) {
      try {
        const localScripts = JSON.parse(localStorage.getItem('brollscan_scripts') || '[]');
        loadedScript = localScripts.find((s: any) => s.id === scriptId) || null;
      } catch {}
    }
    if (loadedScenes.length === 0) {
      try {
        loadedScenes = JSON.parse(localStorage.getItem(`brollscan_scenes_${scriptId}`) || '[]');
      } catch {}
    }

    if (loadedScript) {
      setScriptTitle(loadedScript.title || 'Untitled Script');
    }

    if (loadedScenes && loadedScenes.length > 0) {
      // Load existing broll results
      const sceneIds = loadedScenes.map((s) => s.id);
      let brollData = [];
      let savedData = [];
      try {
        const { data } = await supabase
          .from('broll_results')
          .select('*')
          .in('scene_id', sceneIds)
          .order('relevance_score', { ascending: false });
        brollData = data || [];

        const { data: saved } = await supabase
          .from('saved_clips')
          .select('broll_result_id');
        savedData = saved || [];
      } catch {
        // Fallback: load broll data and saved clips from localStorage
        try {
          brollData = JSON.parse(localStorage.getItem(`brollscan_broll_${scriptId}`) || '[]');
          savedData = JSON.parse(localStorage.getItem(`brollscan_saved_clips`) || '[]').map((id: string) => ({ broll_result_id: id }));
        } catch {}
      }

      if (savedData) {
        setSavedClips(new Set(savedData.map((s: any) => s.broll_result_id || s)));
      }

      const scenesWithResults: SceneWithResults[] = loadedScenes.map((scene) => ({
        ...scene,
        results: (brollData || []).filter((b: any) => b.scene_id === scene.id),
      }));

      setScenes(scenesWithResults);
      setBrollLoaded(scenesWithResults.some((s) => s.results.length > 0));
    }

    setLoading(false);
  }

  async function findBroll() {
    setFindingBroll(true);
    setError('');

    try {
      const res = await fetch(`/api/scripts/${scriptId}/find-broll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenes: scenes.map((s) => ({
            id: s.id,
            keywords: s.keywords,
            scene_order: s.scene_order,
            text_content: s.text_content,
            scene_title: s.scene_title,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to find B-roll');
      }

      const data = await res.json();

      // Update scenes with results
      setScenes((prev) =>
        prev.map((scene) => {
          const sceneResult = data.scenes.find(
            (s: { scene: Scene; results: BrollResult[] }) => s.scene.id === scene.id
          );
          return {
            ...scene,
            results: sceneResult?.results || scene.results,
          };
        })
      );
      setBrollLoaded(true);

      // Save broll results to localStorage
      try {
        const allBrollResults: any[] = [];
        data.scenes.forEach((s: any) => {
          allBrollResults.push(...s.results);
        });
        localStorage.setItem(`brollscan_broll_${scriptId}`, JSON.stringify(allBrollResults));
      } catch (e) {
        console.warn('Failed to save broll results to localStorage:', e);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to find B-roll');
    }

    setFindingBroll(false);
  }

  async function toggleSaveClip(brollResultId: string) {
    const isSaved = savedClips.has(brollResultId);

    try {
      if (isSaved) {
        await fetch('/api/clips/save', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ broll_result_id: brollResultId }),
        });
      } else {
        await fetch('/api/clips/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ broll_result_id: brollResultId }),
        });
      }
    } catch (err) {
      console.warn('Failed to toggle saved clip in DB, saving locally:', err);
    }

    // Always update local state & localStorage
    setSavedClips((prev) => {
      const next = new Set(prev);
      if (isSaved) {
        next.delete(brollResultId);
      } else {
        next.add(brollResultId);
      }
      try {
        localStorage.setItem('brollscan_saved_clips', JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  }

  function scrollToScene(index: number) {
    setActiveScene(index);
    sceneRefs.current.get(index)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="skeleton h-8 w-64 mb-4" />
        <div className="skeleton h-4 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-6">
              <div className="skeleton h-6 w-40 mb-3" />
              <div className="skeleton h-20 w-full mb-4" />
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="skeleton h-24 w-full rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-white">
            {scriptTitle}
          </h1>
          <p className="text-gray-400 mt-1 font-mono text-sm">
            {scenes.length} scenes analyzed
          </p>
        </div>
        {!brollLoaded && scenes.length > 0 && (
          <button
            onClick={findBroll}
            disabled={findingBroll}
            className="btn-mint flex items-center gap-2"
          >
            {findingBroll ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Searching B-Roll...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Find B-Roll Footage
              </>
            )}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Scene navigation bar */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {scenes.map((scene, index) => (
          <button
            key={scene.id}
            onClick={() => scrollToScene(index)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeScene === index
                ? 'bg-violet/20 text-violet-300 border border-violet/30'
                : 'bg-dark-100 text-gray-400 border border-dark-300/50 hover:text-white hover:border-dark-400'
            }`}
          >
            Scene {scene.scene_order}
          </button>
        ))}
      </div>

      {/* Scenes */}
      <div className="space-y-8">
        {scenes.map((scene, index) => (
          <div
            key={scene.id}
            ref={(el) => {
              if (el) sceneRefs.current.set(index, el);
            }}
            className="glass-card overflow-hidden animate-slide-up"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            {/* Scene header */}
            <div className="px-6 py-4 border-b border-dark-300/30 bg-dark-100/40">
              <div className="flex items-center gap-3">
                <span className="badge-scene font-mono">
                  Scene {scene.scene_order}
                </span>
                <h2 className="font-heading font-semibold text-white">
                  {scene.scene_title || `Scene ${scene.scene_order}`}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Script text panel */}
              <div className="p-6 border-r border-dark-300/20">
                <h3 className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-3">
                  Script Text
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {scene.text_content}
                </p>

                {/* Keywords */}
                <div className="mt-4 pt-4 border-t border-dark-300/20">
                  <h4 className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                    Search Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {scene.keywords.map((keyword, ki) => (
                      <span
                        key={ki}
                        className="px-2.5 py-1 bg-violet/10 text-violet-300 text-xs rounded-md border border-violet/15"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* B-roll results panel */}
              <div className="p-6 bg-dark-50/30">
                <h3 className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-3">
                  Matched B-Roll
                  {scene.results.length > 0 && (
                    <span className="ml-2 text-mint">
                      {scene.results.length} clips found
                    </span>
                  )}
                </h3>

                {scene.results.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {scene.results.map((result) => (
                      <VideoCard
                        key={result.id}
                        result={result}
                        isSaved={savedClips.has(result.id)}
                        isPlaying={playingVideo === result.id}
                        onPlay={() =>
                          setPlayingVideo(
                            playingVideo === result.id ? null : result.id
                          )
                        }
                        onToggleSave={() => toggleSaveClip(result.id)}
                      />
                    ))}
                  </div>
                ) : findingBroll ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="skeleton-shimmer h-28 rounded-lg" />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500">
                      {brollLoaded
                        ? 'No matching footage found for this scene'
                        : 'Click "Find B-Roll Footage" to search'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// VideoCard Component
// ============================================================

function VideoCard({
  result,
  isSaved,
  isPlaying,
  onPlay,
  onToggleSave,
}: {
  result: BrollResult;
  isSaved: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onToggleSave: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isPlaying && videoRef.current) {
      videoRef.current.play().catch(() => {});
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isPlaying]);

  return (
    <div className="group relative rounded-lg overflow-hidden bg-dark-200 border border-dark-300/30 hover:border-violet/30 transition-all duration-200">
      {/* Thumbnail / Video */}
      <div className="relative aspect-video cursor-pointer" onClick={onPlay}>
        {isPlaying ? (
          <video
            ref={videoRef}
            src={result.video_url}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
          />
        ) : (
          <img
            src={result.thumbnail_url}
            alt="B-roll clip"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}

        {/* Play overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          </div>
        )}

        {/* Source badge */}
        <div className="absolute top-1.5 left-1.5">
          <span className={result.source === 'pexels' ? 'badge-pexels' : 'badge-pixabay'}>
            {result.source}
          </span>
        </div>

        {/* Duration */}
        {result.duration_seconds && (
          <div className="absolute bottom-1.5 right-1.5">
            <span className="px-1.5 py-0.5 bg-black/70 backdrop-blur-sm rounded text-[10px] font-mono text-white">
              {Math.floor(result.duration_seconds / 60)}:
              {String(Math.floor(result.duration_seconds % 60)).padStart(2, '0')}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-2 py-1.5">
        <button
          onClick={onToggleSave}
          className={`p-1 rounded transition-colors ${
            isSaved
              ? 'text-mint hover:text-mint-400'
              : 'text-gray-500 hover:text-white'
          }`}
          title={isSaved ? 'Remove from saved' : 'Save clip'}
        >
          <svg
            className="w-4 h-4"
            fill={isSaved ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </button>

        <a
          href={result.video_url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1 text-gray-500 hover:text-white rounded transition-colors"
          title="Download / Open source"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </a>
      </div>
    </div>
  );
}
