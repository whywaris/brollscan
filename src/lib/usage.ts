import { PLANS } from '@/lib/constants';
import { createAdminClient } from '@/lib/supabase/admin';

export async function resetUsageIfNeeded(userId: string): Promise<void> {
  try {
    const supabase = createAdminClient();
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('usage_reset_at')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      // PGRST116 is code for "The query returned 0 rows"
      if (error?.code === 'PGRST116') {
        // Create profile if it doesn't exist
        await supabase.from('profiles').insert({ id: userId });
      }
      return;
    }

    if (profile.usage_reset_at) {
      const resetAt = new Date(profile.usage_reset_at);
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      
      if (resetAt < oneMonthAgo) {
        await supabase
          .from('profiles')
          .update({
            scripts_used_this_month: 0,
            usage_reset_at: new Date().toISOString(),
          })
          .eq('id', userId);
      }
    }
  } catch (err) {
    console.error('Error resetting usage:', err);
  }
}

export async function getUsage(userId: string): Promise<{
  scripts_used: number;
  scripts_limit: number;
  plan_type: string;
  can_analyze: boolean;
}> {
  try {
    await resetUsageIfNeeded(userId);
    const supabase = createAdminClient();
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('plan_type, scripts_used_this_month')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      return {
        scripts_used: 0,
        scripts_limit: PLANS.free.scripts_per_month,
        plan_type: 'free',
        can_analyze: true,
      };
    }

    const planType = profile.plan_type || 'free';
    const planConfig = PLANS[planType] || PLANS.free;
    const scriptsLimit = planConfig.scripts_per_month;
    const scriptsUsed = profile.scripts_used_this_month || 0;
    const canAnalyze = scriptsUsed < scriptsLimit;

    return {
      scripts_used: scriptsUsed,
      scripts_limit: scriptsLimit,
      plan_type: planType,
      can_analyze: canAnalyze,
    };
  } catch (err) {
    console.error('Error getting usage:', err);
    return {
      scripts_used: 0,
      scripts_limit: PLANS.free.scripts_per_month,
      plan_type: 'free',
      can_analyze: true,
    };
  }
}

export async function incrementUsage(userId: string): Promise<void> {
  try {
    await resetUsageIfNeeded(userId);
    const supabase = createAdminClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('scripts_used_this_month')
      .eq('id', userId)
      .single();

    if (profile) {
      const currentUsed = profile.scripts_used_this_month || 0;
      await supabase
        .from('profiles')
        .update({
          scripts_used_this_month: currentUsed + 1,
        })
        .eq('id', userId);
    }
  } catch (err) {
    console.error('Error incrementing usage:', err);
  }
}

export async function checkUsageLimit(userId: string): Promise<boolean> {
  const usage = await getUsage(userId);
  return usage.can_analyze;
}
