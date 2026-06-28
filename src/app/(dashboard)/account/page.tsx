'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { PLANS } from '@/lib/constants';
import { User } from '@supabase/supabase-js';

interface UsageStats {
  scripts_used: number;
  scripts_limit: number;
  plan_type: string;
  can_analyze: boolean;
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    async function loadAccountData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      setUser(user);

      try {
        const res = await fetch('/api/usage');
        if (res.ok) {
          const usageData = await res.json();
          setUsage(usageData);
        }
      } catch (error) {
        console.error('Failed to load usage data:', error);
      }

      setLoading(false);
    }

    loadAccountData();
  }, [router]);

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="skeleton h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="skeleton h-48 rounded-xl" />
          <div className="skeleton h-48 rounded-xl" />
        </div>
      </div>
    );
  }

  const currentPlan = PLANS[usage?.plan_type || 'free'] || PLANS.free;
  const usagePercent = usage ? Math.min((usage.scripts_used / usage.scripts_limit) * 100, 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Title */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-white">
          Account Settings
        </h1>
        <p className="text-gray-400 mt-1">
          Manage your plan, subscription, and usage limits
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-heading font-semibold text-white mb-4">
              Profile details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <p className="text-sm font-medium text-white">{user?.email}</p>
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">
                  User ID
                </label>
                <p className="text-xs font-mono text-gray-400 break-all">{user?.id}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-dark-300/20">
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="w-full flex items-center justify-center gap-2 btn-secondary !py-2.5 text-sm"
            >
              {signingOut ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing Out...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out of Account
                </>
              )}
            </button>
          </div>
        </div>

        {/* Plan / Usage Card */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-semibold text-white">
                Usage this month
              </h2>
              <span className="badge-scene">
                {currentPlan.name} Plan
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                    Scripts Scanned
                  </span>
                  <span className="text-sm font-mono font-semibold text-white">
                    {usage?.scripts_used || 0} / {usage?.scripts_limit || 0}
                  </span>
                </div>
                <div className="w-full h-2 bg-dark-200 rounded-full overflow-hidden border border-dark-300/30">
                  <div
                    className="h-full bg-gradient-to-r from-violet to-mint rounded-full transition-all duration-500"
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              </div>

              <div className="text-xs text-gray-400">
                Usage limit resets monthly. Check your plan&apos;s terms for details.
              </div>
            </div>
          </div>

          {usage?.plan_type === 'free' && (
            <div className="mt-8 pt-4 border-t border-dark-300/20">
              <div className="bg-violet/10 border border-violet/20 rounded-lg p-3 text-center">
                <p className="text-xs text-violet-300 mb-2 font-medium">
                  Need more script scans? Upgrade your tier.
                </p>
                <button
                  onClick={() => router.push('/pricing')}
                  className="w-full btn-primary !py-2 text-xs font-medium"
                >
                  View Premium Plans
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
