import Link from 'next/link';
import { PLANS } from '@/lib/constants';

// ============================================================
// SVG Icon Components
// ============================================================

function ScriptIcon() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="4" width="20" height="24" rx="2" stroke="#7C5CFC" strokeWidth="1.5" />
      <line x1="10" y1="10" x2="22" y2="10" stroke="#7C5CFC" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="14" x2="22" y2="14" stroke="#7C5CFC" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="18" x2="18" y2="18" stroke="#3DFFB5" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="22" x2="15" y2="22" stroke="#3DFFB5" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function AIIcon() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="10" stroke="#7C5CFC" strokeWidth="1.5" />
      <path d="M16 6V4M16 28V26M26 16H28M4 16H6M23.07 8.93L24.49 7.51M7.51 24.49L8.93 23.07M23.07 23.07L24.49 24.49M7.51 7.51L8.93 8.93" stroke="#3DFFB5" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="16" cy="16" r="4" fill="#7C5CFC" fillOpacity="0.3" stroke="#7C5CFC" strokeWidth="1.5" />
    </svg>
  );
}

function FilmIcon() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="6" width="24" height="20" rx="2" stroke="#7C5CFC" strokeWidth="1.5" />
      <rect x="7" y="6" width="3" height="20" stroke="#7C5CFC" strokeWidth="0.75" strokeOpacity="0.5" />
      <rect x="22" y="6" width="3" height="20" stroke="#7C5CFC" strokeWidth="0.75" strokeOpacity="0.5" />
      <polygon points="14,12 14,20 21,16" fill="#3DFFB5" fillOpacity="0.6" stroke="#3DFFB5" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" stroke="#7C5CFC" strokeWidth="1.5" strokeLinejoin="round" fill="#7C5CFC" fillOpacity="0.15" />
    </svg>
  );
}

function DualSourceIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="12" r="5" stroke="#7C5CFC" strokeWidth="1.5" />
      <circle cx="16" cy="12" r="5" stroke="#3DFFB5" strokeWidth="1.5" />
    </svg>
  );
}

function RankingIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="14" width="5" height="8" rx="1" fill="#7C5CFC" fillOpacity="0.3" stroke="#7C5CFC" strokeWidth="1.5" />
      <rect x="9.5" y="8" width="5" height="14" rx="1" fill="#7C5CFC" fillOpacity="0.5" stroke="#7C5CFC" strokeWidth="1.5" />
      <rect x="16" y="2" width="5" height="20" rx="1" fill="#3DFFB5" fillOpacity="0.3" stroke="#3DFFB5" strokeWidth="1.5" />
    </svg>
  );
}

function SceneViewIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="3" width="9" height="18" rx="1.5" stroke="#7C5CFC" strokeWidth="1.5" />
      <rect x="13" y="3" width="9" height="8" rx="1.5" stroke="#3DFFB5" strokeWidth="1.5" />
      <rect x="13" y="13" width="9" height="8" rx="1.5" stroke="#3DFFB5" strokeWidth="1.5" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 21L12 16L5 21V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21Z" stroke="#7C5CFC" strokeWidth="1.5" strokeLinejoin="round" fill="#7C5CFC" fillOpacity="0.15" />
    </svg>
  );
}

function FreeIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#3DFFB5" strokeWidth="1.5" strokeLinejoin="round" fill="#3DFFB5" fillOpacity="0.15" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-mint flex-shrink-0 mt-0.5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 8L6.5 11.5L13 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="w-5 h-5 ml-2" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ============================================================
// Data for sections
// ============================================================

const steps = [
  {
    number: '01',
    title: 'Paste Your Script',
    description: 'Upload a .docx or paste any video script — narration, screenplay, talking points, or ad copy.',
    icon: <ScriptIcon />,
  },
  {
    number: '02',
    title: 'AI Scene Analysis',
    description: 'Claude AI breaks your script into visual scenes, extracting keywords and narrative context for each beat.',
    icon: <AIIcon />,
  },
  {
    number: '03',
    title: 'Find B-Roll',
    description: 'Get perfectly matched stock footage from Pexels & Pixabay, ranked by visual relevance to each scene.',
    icon: <FilmIcon />,
  },
];

const features = [
  {
    title: 'AI-Powered Analysis',
    description: 'Claude AI understands visual narrative beats, extracting context-aware keywords that match cinematic intent — not just literal words.',
    icon: <SparkleIcon />,
  },
  {
    title: 'Dual Source Search',
    description: 'Searches Pexels and Pixabay simultaneously, giving you the widest selection of high-quality royalty-free footage in one place.',
    icon: <DualSourceIcon />,
  },
  {
    title: 'Smart Ranking',
    description: 'Results are ranked by visual relevance to your scene using intelligent scoring, so the best clips always surface first.',
    icon: <RankingIcon />,
  },
  {
    title: 'Scene-by-Scene View',
    description: 'See your original script text alongside matched footage for each scene — the fastest way to plan your edit.',
    icon: <SceneViewIcon />,
  },
  {
    title: 'Save Collections',
    description: 'Build your B-roll library by saving your favorite clips to collections. Access them anytime for future projects.',
    icon: <SaveIcon />,
  },
  {
    title: 'Free to Start',
    description: '5 analyses per month on the free plan, no credit card needed. Upgrade when you\'re ready to scale your production.',
    icon: <FreeIcon />,
  },
];

const planOrder = ['free', 'creator', 'studio'] as const;

// ============================================================
// Landing Page Component
// ============================================================

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark bg-grid relative overflow-hidden">

      {/* ============================================================
          Navbar
          ============================================================ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-xl border-b border-dark-300/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-xl font-heading font-bold bg-gradient-to-r from-violet to-mint bg-clip-text text-transparent">
                BrollScan
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-6">
              <Link
                href="#pricing"
                className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-medium"
              >
                Pricing
              </Link>
              <Link
                href="/login"
                className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-medium"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="btn-primary px-4 py-2 text-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ============================================================
          Hero Section
          ============================================================ */}
      <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32 overflow-hidden">
        {/* Decorative gradient glow blobs */}
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-violet/20 rounded-full blur-[128px] animate-pulse-slow pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-mint/10 rounded-full blur-[128px] animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Floating decorative elements */}
        <div className="absolute top-32 left-[10%] w-3 h-3 bg-violet/40 rounded-full animate-float" />
        <div className="absolute top-48 right-[15%] w-2 h-2 bg-mint/40 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-64 left-[20%] w-1.5 h-1.5 bg-violet/30 rounded-full animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-32 right-[25%] w-2.5 h-2.5 bg-mint/30 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-56 right-[8%] w-4 h-4 border border-violet/20 rounded-sm rotate-45 animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-48 left-[12%] w-3 h-3 border border-mint/20 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet/10 border border-violet/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
            <span className="text-sm font-mono text-violet-200">AI-Powered B-Roll Discovery</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading font-bold leading-[1.1] tracking-tight mb-6">
            <span className="block text-white">Find Perfect B-Roll</span>
            <span className="block bg-gradient-to-r from-violet via-violet-300 to-mint bg-clip-text text-transparent">
              for Every Scene
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            AI-powered script analysis meets stock footage search. Paste your script,
            get matched clips from Pexels and Pixabay in seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="btn-primary text-lg px-8 py-4 flex items-center group"
            >
              Start Scanning — Free
              <ArrowRightIcon />
            </Link>
            <Link
              href="#how-it-works"
              className="btn-secondary text-lg px-8 py-4"
            >
              See How It Works
            </Link>
          </div>

          {/* Social proof hint */}
          <p className="mt-8 text-sm text-gray-500 font-mono">
            No credit card required · 5 free analyses per month
          </p>
        </div>
      </section>

      {/* ============================================================
          How It Works
          ============================================================ */}
      <section id="how-it-works" className="relative py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-sm font-mono text-violet-300 uppercase tracking-widest">How It Works</span>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white">
              Three Steps to Perfect B-Roll
            </h2>
            <p className="mt-4 text-gray-400 text-lg max-w-xl mx-auto">
              From script to stock footage in under a minute.
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-1/2 left-[16.6%] right-[16.6%] h-px bg-gradient-to-r from-violet/40 via-violet/20 to-mint/40 -translate-y-1/2 z-0" />

            {steps.map((step, index) => (
              <div key={step.number} className="relative z-10 group">
                <div className="glass-card-hover p-8 text-center h-full">
                  {/* Step Number */}
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-dark-200 border border-dark-400 mb-6 group-hover:border-violet/40 transition-colors">
                    <span className="text-sm font-mono font-bold bg-gradient-to-r from-violet to-mint bg-clip-text text-transparent">
                      {step.number}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="flex justify-center mb-5">
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-heading font-semibold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    {step.description}
                  </p>
                </div>

                {/* Arrow between steps (mobile) */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center py-4">
                    <svg className="w-6 h-6 text-violet/40" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5V19M12 19L6 13M12 19L18 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          Features Section
          ============================================================ */}
      <section className="relative py-24 sm:py-32">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-violet/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-sm font-mono text-mint uppercase tracking-widest">Features</span>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white">
              Everything You Need
            </h2>
            <p className="mt-4 text-gray-400 text-lg max-w-xl mx-auto">
              Built for video creators who need the right footage, fast.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="glass-card-hover p-6 group"
              >
                {/* Icon container */}
                <div className="w-12 h-12 rounded-lg bg-dark-200 border border-dark-400 flex items-center justify-center mb-5 group-hover:border-violet/30 transition-colors">
                  {feature.icon}
                </div>

                <h3 className="text-lg font-heading font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          Pricing Section
          ============================================================ */}
      <section id="pricing" className="relative py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-sm font-mono text-violet-300 uppercase tracking-widest">Pricing</span>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-gray-400 text-lg max-w-xl mx-auto">
              Start free, upgrade when your production demands it.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {planOrder.map((planKey) => {
              const plan = PLANS[planKey];
              const isHighlighted = plan.highlighted;

              return (
                <div
                  key={planKey}
                  className={`relative rounded-xl p-px ${
                    isHighlighted
                      ? 'bg-gradient-to-b from-violet via-violet/50 to-mint/30'
                      : 'bg-dark-300/50'
                  }`}
                >
                  {/* Popular badge */}
                  {isHighlighted && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                      <span className="px-4 py-1 bg-violet text-white text-xs font-mono font-semibold rounded-full shadow-glow-violet">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className={`rounded-xl p-8 h-full flex flex-col ${
                    isHighlighted ? 'bg-dark-50' : 'bg-dark-100/80'
                  }`}>
                    {/* Plan name */}
                    <h3 className="text-lg font-heading font-semibold text-white mb-2">
                      {plan.name}
                    </h3>

                    {/* Price */}
                    <div className="mb-6">
                      <span className="text-4xl font-heading font-bold text-white">
                        ${plan.price}
                      </span>
                      <span className="text-gray-500 ml-1">/month</span>
                    </div>

                    {/* Analyses count */}
                    <p className="text-sm text-gray-400 mb-6 pb-6 border-b border-dark-300/50">
                      <span className="text-white font-semibold">{plan.scripts_per_month}</span> script analyses per month
                    </p>

                    {/* Feature list */}
                    <ul className="space-y-3 mb-8 flex-grow">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-sm text-gray-300">
                          <CheckIcon />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Link
                      href="/signup"
                      className={`w-full text-center py-3 px-6 rounded-lg font-medium transition-all duration-200 active:scale-[0.98] ${
                        isHighlighted
                          ? 'bg-violet hover:bg-violet-500 text-white hover:shadow-glow-violet'
                          : 'bg-dark-200 hover:bg-dark-300 text-white border border-dark-400'
                      }`}
                    >
                      {plan.price === 0 ? 'Get Started Free' : `Start ${plan.name} Plan`}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          CTA Section
          ============================================================ */}
      <section className="relative py-24 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-2xl p-px bg-gradient-to-r from-violet/60 via-violet/20 to-mint/40 overflow-hidden">
            <div className="rounded-2xl bg-dark-50 p-12 sm:p-16 text-center relative overflow-hidden">
              {/* Glow effects */}
              <div className="absolute top-0 left-1/4 w-[300px] h-[200px] bg-violet/10 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute bottom-0 right-1/4 w-[200px] h-[150px] bg-mint/5 rounded-full blur-[60px] pointer-events-none" />

              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4 leading-tight">
                  Ready to Find Your{' '}
                  <span className="bg-gradient-to-r from-violet to-mint bg-clip-text text-transparent">
                    Perfect B-Roll?
                  </span>
                </h2>
                <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
                  Join creators who save hours finding the right stock footage for every scene.
                </p>
                <Link
                  href="/signup"
                  className="btn-primary text-lg px-10 py-4 inline-flex items-center"
                >
                  Start Scanning — Free
                  <ArrowRightIcon />
                </Link>
                <p className="mt-4 text-sm text-gray-500 font-mono">
                  No credit card · Setup in 30 seconds
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          Footer
          ============================================================ */}
      <footer className="border-t border-dark-300/50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Logo & Copyright */}
            <div className="flex flex-col items-center sm:items-start gap-2">
              <Link href="/" className="text-lg font-heading font-bold bg-gradient-to-r from-violet to-mint bg-clip-text text-transparent">
                BrollScan
              </Link>
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} BrollScan. All rights reserved.
              </p>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 text-sm">
              <Link href="#pricing" className="text-gray-400 hover:text-white transition-colors duration-200">
                Pricing
              </Link>
              <Link href="/login" className="text-gray-400 hover:text-white transition-colors duration-200">
                Login
              </Link>
              <Link href="/signup" className="text-gray-400 hover:text-white transition-colors duration-200">
                Sign Up
              </Link>
            </div>

            {/* Powered by */}
            <div className="text-sm text-gray-500 flex items-center gap-1.5">
              <span>Powered by</span>
              <span className="text-gray-400 font-medium">Pexels</span>
              <span>&</span>
              <span className="text-gray-400 font-medium">Pixabay</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
