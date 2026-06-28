import { PLANS } from '@/lib/constants';

export async function getUsage(userId: string): Promise<{
  scripts_used: number;
  scripts_limit: number;
  plan_type: string;
  can_analyze: boolean;
}> {
  return {
    scripts_used: 0,
    scripts_limit: 9999,
    plan_type: 'creator',
    can_analyze: true,
  };
}

export async function incrementUsage(userId: string): Promise<void> {
  // Do nothing in mock mode
}

export async function resetUsageIfNeeded(userId: string): Promise<void> {
  // Do nothing in mock mode
}

export async function checkUsageLimit(userId: string): Promise<boolean> {
  return true;
}
