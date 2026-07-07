'use client'

import Link from 'next/link'
import {
  Zap, Target, TrendingUp, BarChart3, Globe, Brain,
  CheckCircle, ArrowRight, Star, Users, Sparkles,
  Play
} from 'lucide-react'

const PLATFORMS = ['Google Ads', 'Meta Ads', 'LinkedIn', 'YouTube', 'Shopping']

const STATS = [
  { value: '10x', label: 'Faster Campaign Setup', icon: Zap },
  { value: '73%', label: 'Average Cost Reduction', icon: TrendingUp },
  { value: '5000+', label: 'Campaigns Generated', icon: Target },
  { value: '98%', label: 'Client Satisfaction', icon: Star },
]

const FEATURES = [
  {
    icon: Brain,
    title: 'AI Website Analysis',
    description: 'Paste your URL. Our AI extracts your USPs, identifies your audience, and understands your business in seconds.',
    color: 'brand',
  },
  {
    icon: Target,
    title: 'Competitor Intelligence',
    description: 'Automatically identify competitors, analyze their messaging, and find gaps you can exploit in your campaigns.',
    color: 'sky',
  },
  {
    icon: BarChart3,
    title: 'Complete Campaign Builder',
    description: 'Full campaign structure with keywords, ad copy, audiences, and creative angles across all major platforms.',
    color: 'violet',
  },
  {
    icon: Globe,
    title: 'Landing Page Audit',
    description: 'AI-powered CRO analysis with actionable recommendations to maximize your conversion rate before you spend.',
    color: 'emerald',
  },
  {
    icon: TrendingUp,
    title: 'Performance Forecasting',
    description: 'Realistic CPC, CTR, and ROAS projections based on industry data so you know what to expect.',
    color: 'amber',
  },
  {
    icon: Users,
    title: 'Client-Ready Reports',
    description: 'Auto-generate weekly, monthly, and quarterly reports. Export as PDF or PowerPoint in one click.',
    color: 'rose',
  },
]

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Head of Marketing, TechFlow SaaS',
    content: 'AdPilot replaced two weeks of campaign planning with 8 minutes. The keyword research alone is worth the subscription.',
    avatar: 'PS',
    rating: 5,
  },
  {
    name: 'Rahul Mehta',
    role: 'Founder, DigitalSprint Agency',
    content: 'We onboard new clients 5x faster now. The competitor analysis feature is genuinely impressive.',
    avatar: 'RM',
    rating: 5,
  },
  {
    name: 'Anjali Nair',
    role: 'E-commerce Manager, StyleHive',
    content: 'Shopping campaign structure, Performance Max setup, ROAS strategy — all in minutes. Incredible tool.',
    avatar: 'AN',
    rating: 5,
  },
]

const PLANS = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    features: ['3 Projects', 'Google & Meta Ads', 'Basic Analysis', 'CSV Export', 'Community Support'],
    cta: 'Start Free',
    href: '/signup',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '₹2,999',
    period: '/month',
    features: ['Unlimited Projects', 'All 5 Platforms', 'Competitor Intelligence', 'Creative Studio', 'Landing Audit', 'Forecasting', 'PDF & PPT Reports', 'Priority Support'],
    cta: 'Start Pro Trial',
    href: '/signup?plan=pro',
    highlighted: true,
  },
  {
    name: 'Agency',
    price: '₹7,999',
    period: '/month',
    features: ['Everything in Pro', 'Unlimited Team Members', 'White Label Reports', 'Multiple Clients', 'API Access', 'Dedicated Manager'],
    cta: 'Contact Sales',
    href: '/signup?plan=agency',
    highlighted: false,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">AdPilot AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-gray-900 transition-colors">Reviews</a>
            <Link href="/login" className="hover:text-gray-900 transition-colors">Sign In</Link>
          </div>
          <Link
            href="/signup"
            className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 bg-grid-pattern">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-sm font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            AI Performance Marketing Manager
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight leading-none mb-6">
            Replace weeks of<br />
            <span className="gradient-text">campaign planning</span><br />
            with 8 minutes.
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Input your URL. AdPilot AI analyzes your business, studies competitors,
            and builds complete campaign blueprints across Google, Meta, LinkedIn & YouTube.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/signup"
              className="flex items-center gap-2 px-8 py-4 bg-brand-600 text-white rounded-xl font-semibold text-lg hover:bg-brand-700 transition-all hover:shadow-lg hover:shadow-brand-200 hover:-translate-y-0.5"
            >
              Generate My First Campaign
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="flex items-center gap-2 px-6 py-4 border border-gray-200 rounded-xl text-gray-700 font-medium hover:border-gray-300 hover:bg-gray-50 transition-all">
              <Play className="w-4 h-4 text-brand-500" />
              Watch Demo
            </button>
          </div>

          {/* Platform badges */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {PLATFORMS.map((p) => (
              <span
                key={p}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 shadow-sm"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Hero image / mockup placeholder */}
        <div className="max-w-6xl mx-auto mt-16">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/80 overflow-hidden">
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-4 bg-white border border-gray-200 rounded-lg px-3 py-1 text-xs text-gray-500">
                app.adpilot.ai/dashboard
              </div>
            </div>
            {/* Dashboard preview */}
            <div className="grid grid-cols-4 gap-0 h-80 bg-gray-50">
              {/* Sidebar preview */}
              <div className="col-span-1 bg-white border-r border-gray-100 p-4 space-y-1">
                {['Dashboard', 'Projects', 'Campaigns', 'Creative Studio', 'Reports', 'Settings'].map((item) => (
                  <div key={item} className={`px-3 py-2 rounded-lg text-xs ${item === 'Campaigns' ? 'bg-brand-50 text-brand-600 font-medium' : 'text-gray-500'}`}>
                    {item}
                  </div>
                ))}
              </div>
              {/* Main content preview */}
              <div className="col-span-3 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-1" />
                    <div className="h-3 w-48 bg-gray-100 rounded animate-pulse" />
                  </div>
                  <div className="h-8 w-28 bg-brand-500 rounded-lg opacity-80" />
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {['Campaigns', 'Ad Groups', 'Keywords', 'Impressions'].map((s) => (
                    <div key={s} className="bg-white rounded-xl border border-gray-100 p-3">
                      <div className="h-6 w-12 bg-brand-100 rounded mb-1" />
                      <div className="h-3 w-16 bg-gray-100 rounded" />
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-4 h-28 flex items-center justify-center">
                  <div className="text-xs text-gray-400">AI-Generated Campaign Structure Preview</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-1">{value}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything a PPC team does — automated</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              From website analysis to campaign export, AdPilot handles the entire workflow so you focus on strategy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {FEATURES.map(({ icon: Icon, title, description, color }) => (
              <div key={title} className="p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-200 bg-white group">
                <div className={`w-10 h-10 rounded-xl bg-${color}-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 text-${color}-600`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">From URL to campaign blueprint in 8 minutes</h2>
          </div>
          <div className="space-y-4">
            {[
              { step: '01', title: 'Enter your website URL & goals', desc: 'Tell us your business goal, monthly budget, target country, and ad platforms.' },
              { step: '02', title: 'AI analyzes your business & competitors', desc: 'Our AI crawls your site, extracts your USPs, and identifies your top competitors.' },
              { step: '03', title: 'Receive your complete campaign blueprint', desc: 'Full campaign structure, keywords, ad copy, audiences, creative concepts, and forecasts.' },
              { step: '04', title: 'Export & launch', desc: 'Download CSV for Google Ads, export to your ad platform, or share the client-ready report.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-6 items-start p-6 bg-white rounded-2xl border border-gray-100">
                <div className="text-2xl font-bold text-brand-200 font-mono flex-shrink-0 w-10">{step}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Loved by marketers & agencies</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, content, avatar, rating }) => (
              <div key={name} className="p-6 rounded-2xl border border-gray-100 bg-white">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">&ldquo;{content}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-600">
                    {avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{name}</div>
                    <div className="text-xs text-gray-500">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">Simple, transparent pricing</h2>
          <p className="text-gray-500 text-center mb-16">Start free. Upgrade when you&apos;re ready.</p>

          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map(({ name, price, period, features, cta, href, highlighted }) => (
              <div
                key={name}
                className={`p-6 rounded-2xl border ${
                  highlighted
                    ? 'border-brand-500 bg-brand-600 text-white shadow-2xl shadow-brand-200 scale-105'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="mb-6">
                  <div className={`text-sm font-medium mb-1 ${highlighted ? 'text-brand-200' : 'text-gray-500'}`}>{name}</div>
                  <div className={`text-4xl font-bold ${highlighted ? 'text-white' : 'text-gray-900'}`}>
                    {price}
                    <span className={`text-lg font-normal ${highlighted ? 'text-brand-200' : 'text-gray-400'}`}>{period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${highlighted ? 'text-brand-100' : 'text-gray-600'}`}>
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 ${highlighted ? 'text-brand-200' : 'text-brand-500'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={href}
                  className={`block w-full text-center py-3 rounded-xl font-medium transition-all ${
                    highlighted
                      ? 'bg-white text-brand-600 hover:bg-brand-50'
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-brand-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Stop spending weeks on campaign planning.
          </h2>
          <p className="text-brand-200 text-lg mb-8">
            Join thousands of marketers who generate complete campaign blueprints in minutes.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-600 rounded-xl font-semibold text-lg hover:bg-brand-50 transition-colors"
          >
            Start Free — No Credit Card Required
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-gray-900">AdPilot AI</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="/privacy" className="hover:text-gray-900">Privacy</a>
            <a href="/terms" className="hover:text-gray-900">Terms</a>
            <a href="/support" className="hover:text-gray-900">Support</a>
          </div>
          <div className="text-sm text-gray-400">© 2024 AdPilot AI. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
