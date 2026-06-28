import { NormalizedVideoResult, PexelsSearchResponse, PixabaySearchResponse } from '@/types';
import { PEXELS_API_BASE, PIXABAY_API_BASE, BROLL_RESULTS_PER_SCENE } from '@/lib/constants';

// ============================================================
// Pexels API
// ============================================================

async function searchPexels(query: string): Promise<NormalizedVideoResult[]> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    console.warn('PEXELS_API_KEY not configured');
    return [];
  }

  try {
    const url = `${PEXELS_API_BASE}?query=${encodeURIComponent(query)}&per_page=10&size=medium`;
    const response = await fetch(url, {
      headers: {
        Authorization: apiKey,
      },
    });

    if (!response.ok) {
      console.error(`Pexels API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data: PexelsSearchResponse = await response.json();

    return data.videos.map((video) => {
      // Get the best quality video file (prefer HD)
      const videoFile = video.video_files.find(f => f.quality === 'hd') 
        || video.video_files.find(f => f.quality === 'sd')
        || video.video_files[0];

      return {
        source: 'pexels' as const,
        external_id: String(video.id),
        thumbnail_url: video.image,
        video_url: videoFile?.link || '',
        preview_url: video.video_files.find(f => f.quality === 'sd')?.link || videoFile?.link || '',
        duration_seconds: video.duration,
        title: `Pexels Video ${video.id}`,
        tags: query.split(' '),
        width: video.width,
        height: video.height,
        relevance_score: 0,
      };
    });
  } catch (error) {
    console.error('Pexels search error:', error);
    return [];
  }
}

// ============================================================
// Pixabay API
// ============================================================

async function searchPixabay(query: string): Promise<NormalizedVideoResult[]> {
  const apiKey = process.env.PIXABAY_API_KEY;
  if (!apiKey) {
    console.warn('PIXABAY_API_KEY not configured');
    return [];
  }

  try {
    const url = `${PIXABAY_API_BASE}?key=${apiKey}&q=${encodeURIComponent(query)}&per_page=10`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Pixabay API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data: PixabaySearchResponse = await response.json();

    return data.hits.map((hit) => {
      const videoData = hit.videos.medium || hit.videos.small || hit.videos.tiny;

      return {
        source: 'pixabay' as const,
        external_id: String(hit.id),
        thumbnail_url: `https://i.vimeocdn.com/video/${hit.id}_640x360.jpg`,
        video_url: hit.videos.large?.url || videoData.url,
        preview_url: hit.videos.small?.url || hit.videos.tiny?.url || videoData.url,
        duration_seconds: hit.duration,
        title: hit.tags.split(',')[0]?.trim() || `Pixabay Video ${hit.id}`,
        tags: hit.tags.split(',').map((t: string) => t.trim()),
        width: videoData.width,
        height: videoData.height,
        relevance_score: 0,
      };
    });
  } catch (error) {
    console.error('Pixabay search error:', error);
    return [];
  }
}

// ============================================================
// Relevance Scoring
// ============================================================

function calculateRelevance(video: NormalizedVideoResult, keywords: string[]): number {
  const normalizedKeywords = keywords.map(k => k.toLowerCase());
  const videoText = [...video.tags, video.title].join(' ').toLowerCase();
  
  let score = 0;
  for (const keyword of normalizedKeywords) {
    const keywordWords = keyword.split(' ');
    for (const word of keywordWords) {
      if (videoText.includes(word)) {
        score += 1;
      }
    }
    // Bonus for full keyword match
    if (videoText.includes(keyword)) {
      score += 2;
    }
  }

  // Normalize to 0-1 range
  const maxPossible = normalizedKeywords.length * 3 + normalizedKeywords.reduce((sum, k) => sum + k.split(' ').length, 0);
  return maxPossible > 0 ? Math.min(score / maxPossible, 1) : 0;
}

// ============================================================
// Merge, Dedupe, and Rank
// ============================================================

function mergeAndRank(
  pexelsResults: NormalizedVideoResult[],
  pixabayResults: NormalizedVideoResult[],
  keywords: string[]
): NormalizedVideoResult[] {
  const allResults = [...pexelsResults, ...pixabayResults];

  // Calculate relevance scores
  for (const result of allResults) {
    result.relevance_score = calculateRelevance(result, keywords);
  }

  // Dedupe by external_id + source
  const seen = new Set<string>();
  const deduped = allResults.filter((r) => {
    const key = `${r.source}-${r.external_id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort by relevance (descending)
  deduped.sort((a, b) => b.relevance_score - a.relevance_score);

  // Cap at limit
  return deduped.slice(0, BROLL_RESULTS_PER_SCENE);
}

// ============================================================
// Public API
// ============================================================

export async function searchBrollForScene(
  keywords: string[]
): Promise<NormalizedVideoResult[]> {
  // Combine keywords into a single search query
  const query = keywords.slice(0, 3).join(' ');

  // Search both APIs in parallel
  const [pexelsResults, pixabayResults] = await Promise.all([
    searchPexels(query),
    searchPixabay(query),
  ]);

  return mergeAndRank(pexelsResults, pixabayResults, keywords);
}

export async function searchBrollForAllScenes(
  scenes: Array<{ id: string; keywords: string[] }>
): Promise<Map<string, NormalizedVideoResult[]>> {
  const results = new Map<string, NormalizedVideoResult[]>();

  // Process scenes in parallel (but limit concurrency to avoid rate limits)
  const CONCURRENCY = 3;
  for (let i = 0; i < scenes.length; i += CONCURRENCY) {
    const batch = scenes.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map((scene) => searchBrollForScene(scene.keywords))
    );
    batch.forEach((scene, idx) => {
      results.set(scene.id, batchResults[idx]);
    });
  }

  return results;
}
