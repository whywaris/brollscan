import { PlanConfig } from '@/types';

// ============================================================
// Plan Configurations
// ============================================================

export const PLANS: Record<string, PlanConfig> = {
  free: {
    name: 'Free',
    slug: 'free',
    price: 0,
    scripts_per_month: 5,
    features: [
      '5 script analyses per month',
      'Up to 6 B-roll matches per scene',
      'Pexels + Pixabay sources',
      'Save clips to collection',
      'Basic scene analysis',
    ],
  },
  creator: {
    name: 'Creator',
    slug: 'creator',
    price: 19,
    scripts_per_month: 50,
    highlighted: true,
    features: [
      '50 script analyses per month',
      'Up to 12 B-roll matches per scene',
      'Pexels + Pixabay sources',
      'Save clips to collection',
      'Advanced scene analysis',
      'Priority processing',
      'Export scene breakdowns',
    ],
  },
  studio: {
    name: 'Studio',
    slug: 'studio',
    price: 49,
    scripts_per_month: 200,
    features: [
      '200 script analyses per month',
      'Up to 20 B-roll matches per scene',
      'All video sources',
      'Unlimited saved clips',
      'AI-powered scene analysis',
      'Priority processing',
      'Export scene breakdowns',
      'Team collaboration',
      'API access',
    ],
  },
};

// ============================================================
// API Constants
// ============================================================

export const BROLL_RESULTS_PER_SCENE = 6;
export const MIN_SCENES = 8;
export const MAX_SCENES = 20;

export const PEXELS_API_BASE = 'https://api.pexels.com/videos/search';
export const PIXABAY_API_BASE = 'https://pixabay.com/api/videos/';

// ============================================================
// UI Constants
// ============================================================

export const APP_NAME = 'BrollScan';
export const APP_DESCRIPTION = 'AI-powered B-roll finder for video creators. Analyze your script, find perfect stock footage for every scene.';
export const APP_URL = 'https://brollscan.com';
