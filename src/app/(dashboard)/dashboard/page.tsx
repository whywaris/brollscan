'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Script } from '@/types';

export default function DashboardPage() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [usage, setUsage] = useState({ scripts_used: 0, scripts_limit: 5 });

  useEffect(() => {
    loadScripts();
    loadUsage();
  }, []);

  async function loadScripts() {
    const supabase = createClient();
    let dataToSet = [];
    try {
      const { data, error } = await supabase
        .from('scripts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        dataToSet = data;
      } else {
        throw new Error('No Supabase data');
      }
    } catch {
      try {
        const localScripts = JSON.parse(localStorage.getItem('brollscan_scripts') || '[]');
        localScripts.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        dataToSet = localScripts;
      } catch {}
    }
    setScripts(dataToSet);
    setLoading(false);
  }

  async function loadUsage() {
    try {
      const res = await fetch('/api/usage');
      if (res.ok) {
        const data = await res.json();
        setUsage(data);
      }
    } catch {
      // ignore
    }
  }

  async function deleteScript(id: string) {
    const supabase = createClient();
    try {
      await supabase.from('scripts').delete().eq('id', id);
    } catch {}
    try {
      const localScripts = JSON.parse(localStorage.getItem('brollscan_scripts') || '[]');
      const updated = localScripts.filter((s: any) => s.id !== id);
      localStorage.setItem('brollscan_scripts', JSON.stringify(updated));
      localStorage.removeItem(`brollscan_scenes_${id}`);
      localStorage.removeItem(`brollscan_broll_${id}`);
    } catch {}
    setScripts(scripts.filter(s => s.id !== id));
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-white">
            Your Scripts
          </h1>
          <p className="text-gray-400 mt-1">
            Manage your analyzed scripts and find B-roll footage
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Usage counter */}
          <div className="glass-panel px-4 py-2.5 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-gray-400">
                <span className="text-violet-300 font-semibold">{usage.scripts_used}</span>
                /{usage.scripts_limit}
              </span>
              <span className="text-xs text-gray-500">scripts</span>
            </div>
            <div className="w-16 h-1.5 bg-dark-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet to-mint rounded-full transition-all duration-500"
                style={{ width: `${Math.min((usage.scripts_used / usage.scripts_limit) * 100, 100)}%` }}
              />
            </div>
          </div>
          <Link href="/dashboard/new" className="btn-primary flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">New Scan</span>
          </Link>
        </div>
      </div>

      {/* Scripts list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="skeleton h-5 w-48" />
                  <div className="skeleton h-4 w-32" />
                  <div className="skeleton h-3 w-64" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : scripts.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-violet/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-heading font-semibold text-white mb-2">
            No scripts yet
          </h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Paste or upload a video script to analyze it and find matching B-roll footage from Pexels and Pixabay.
          </p>
          <Link href="/dashboard/new" className="btn-primary inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Analyze Your First Script
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {scripts.map((script, index) => (
            <div
              key={script.id}
              className="glass-card-hover p-5 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-base font-heading font-semibold text-white truncate">
                      {script.title || 'Untitled Script'}
                    </h3>
                    {script.scene_count && (
                      <span className="badge-scene">
                        {script.scene_count} scenes
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                    {script.raw_text.slice(0, 200)}...
                  </p>
                  <p className="text-xs text-gray-500 font-mono">
                    {new Date(script.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={`/dashboard/scripts/${script.id}`}
                    className="btn-primary !px-4 !py-2 text-sm flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View
                  </Link>
                  <button
                    onClick={() => deleteScript(script.id)}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete script"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
