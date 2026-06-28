// ============================================================
// BrollScan — Core Type Definitions
// ============================================================

export interface Profile {
  id: string;
  email: string;
  plan_type: 'free' | 'creator' | 'studio';
  scripts_used_this_month: number;
  usage_reset_at: string;
  created_at: string;
}

export interface Script {
  id: string;
  user_id: string;
  title: string | null;
  raw_text: string;
  scene_count: number | null;
  created_at: string;
}

export interface Scene {
  id: string;
  script_id: string;
  scene_order: number;
  text_content: string;
  keywords: string[];
  scene_title: string | null;
}

export interface BrollResult {
  id: string;
  scene_id: string;
  source: 'pexels' | 'pixabay';
  thumbnail_url: string;
  video_url: string;
  duration_seconds: number | null;
  relevance_score: number | null;
  external_id: string | null;
}

export interface SavedClip {
  id: string;
  user_id: string;
  broll_result_id: string;
  saved_at: string;
  // Joined data
  broll_result?: BrollResult;
}

// ============================================================
// Claude API Response Types
// ============================================================

export interface ClaudeSceneResult {
  scene_order: number;
  scene_title: string;
  text_content: string;
  keywords: string[];
}

// ============================================================
// Stock Footage API Types
// ============================================================

export interface NormalizedVideoResult {
  source: 'pexels' | 'pixabay';
  external_id: string;
  thumbnail_url: string;
  video_url: string;
  preview_url: string;
  duration_seconds: number;
  title: string;
  tags: string[];
  width: number;
  height: number;
  relevance_score: number;
}

// Pexels API types
export interface PexelsVideoFile {
  id: number;
  quality: string;
  file_type: string;
  width: number;
  height: number;
  fps: number;
  link: string;
}

export interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  url: string;
  image: string;
  duration: number;
  user: { name: string; url: string };
  video_files: PexelsVideoFile[];
}

export interface PexelsSearchResponse {
  page: number;
  per_page: number;
  total_results: number;
  videos: PexelsVideo[];
}

// Pixabay API types
export interface PixabayVideoHit {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  duration: number;
  videos: {
    large: { url: string; width: number; height: number; size: number };
    medium: { url: string; width: number; height: number; size: number };
    small: { url: string; width: number; height: number; size: number };
    tiny: { url: string; width: number; height: number; size: number };
  };
  userImageURL: string;
}

export interface PixabaySearchResponse {
  total: number;
  totalHits: number;
  hits: PixabayVideoHit[];
}

// ============================================================
// API Request/Response Types
// ============================================================

export interface AnalyzeRequest {
  text: string;
  title?: string;
}

export interface AnalyzeResponse {
  script: Script;
  scenes: Scene[];
}

export interface FindBrollResponse {
  scenes: Array<{
    scene: Scene;
    results: BrollResult[];
  }>;
}

export interface UsageResponse {
  scripts_used: number;
  scripts_limit: number;
  plan_type: string;
  can_analyze: boolean;
}

// ============================================================
// Plan Configuration
// ============================================================

export interface PlanConfig {
  name: string;
  slug: 'free' | 'creator' | 'studio';
  price: number;
  scripts_per_month: number;
  features: string[];
  highlighted?: boolean;
}
