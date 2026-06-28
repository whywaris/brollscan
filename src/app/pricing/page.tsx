import Link from 'next/link';
import { PLANS } from '@/lib/constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing — BrollScan',
  description: 'Choose the best plan for your B-roll finding needs. Free, Creator, and Studio plans available.',
};

export default function PricingPage() {
  return (
    <div className="relative min-h-screen bg-dark overflow-hidden bg-grid text-foreground">
      {/* Background Glow Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-gradient-glow rounded-full blur-[120px] pointer-events-none opacity-40 animate-pulse-slow" />
      <div className="absolute bottom-[10%] left-[-10%] w-[60%] h-[60%] bg-gradient-glow rounded-full blur-[150px] pointer-events-none opacity-20" />

      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-xl border-b border-dark-300/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet to-mint flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-heading text-xl font-bold bg-gradient-to-r from-violet-300 to-mint bg-clip-text text-transparent">
              BrollScan
            </span>
          </Link>
          <nav className="flex items-center gap-6 sm:gap-8">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
              Home
            </Link>
            <Link href="/login" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
              Login
            </Link>
            <Link href="/signup" className="btn-primary !px-4 !py-2 text-sm">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Choose Your <span className="bg-gradient-to-r from-violet-400 to-mint bg-clip-text text-transparent">Plan</span>
          </h1>
          <p className="text-gray-400 mt-3 text-lg leading-relaxed">
            Get instant access to B-roll matching from Pexels and Pixabay. Start free, upgrade as you scale.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-24">
          {Object.values(PLANS).map((plan) => (
            <div
              key={plan.slug}
              className={`glass-card p-8 flex flex-col justify-between relative ${
                plan.highlighted
                  ? 'border-violet shadow-glow-violet bg-dark-100/90'
                  : 'border-dark-300/50'
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-violet text-[10px] font-mono font-semibold text-white uppercase tracking-wider">
                  Most Popular
                </span>
              )}
              <div>
                <h3 className="font-heading text-2xl font-bold text-white">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl sm:text-5xl font-heading font-extrabold text-white">
                    ${plan.price}
                  </span>
                  <span className="ml-1 text-sm font-mono text-gray-500">/month</span>
                </div>
                <p className="mt-2 text-xs font-mono text-violet-300">
                  {plan.scripts_per_month} script scans / month
                </p>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-300">
                      <svg className="w-4 h-4 text-mint mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  href="/signup"
                  className={`w-full block text-center py-3.5 rounded-lg font-medium text-sm transition-all ${
                    plan.highlighted
                      ? 'btn-primary shadow-glow-violet'
                      : 'btn-secondary border border-dark-300 hover:border-dark-400'
                  }`}
                >
                  {plan.slug === 'free' ? 'Get Started for Free' : `Go ${plan.name}`}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <section className="max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="glass-card p-6 border-dark-300/40">
              <h3 className="text-base font-semibold text-white mb-2">How does the monthly scan limit work?</h3>
              <p className="text-sm text-gray-400">
                Each plan gives you a set amount of script scans per month. A scan is counted when you analyze a new script with AI. Rerunning stock B-roll matches on an already analyzed script does not use any additional scans.
              </p>
            </div>
            <div className="glass-card p-6 border-dark-300/40">
              <h3 className="text-base font-semibold text-white mb-2">Can I save clips to my account?</h3>
              <p className="text-sm text-gray-400">
                Yes! All tiers, including the Free tier, allow you to save matched clips to your personal collection. Saved clips can be downloaded or reviewed at any time from your dashboard.
              </p>
            </div>
            <div className="glass-card p-6 border-dark-300/40">
              <h3 className="text-base font-semibold text-white mb-2">Where does the footage come from?</h3>
              <p className="text-sm text-gray-400">
                We search Pexels API and Pixabay API in parallel. All matched footage is royalty-free and safe for commercial use, subject to their respective terms of service.
              </p>
            </div>
            <div className="glass-card p-6 border-dark-300/40">
              <h3 className="text-base font-semibold text-white mb-2">Can I upgrade or downgrade anytime?</h3>
              <p className="text-sm text-gray-400">
                Absolutely. You can change your plan at any time. When you upgrade, your monthly scan count is updated immediately.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-300/30 bg-dark-50/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet to-mint flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-heading text-lg font-bold text-white">
              BrollScan
            </span>
          </div>
          <div className="text-xs text-gray-500 font-mono">
            &copy; {new Date().getFullYear()} BrollScan. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
