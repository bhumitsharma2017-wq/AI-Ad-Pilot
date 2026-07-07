'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Mail, MessageCircle, Book, ChevronDown, Search,
  Zap, CreditCard, Globe, Shield, Sparkles
} from 'lucide-react'

const CATEGORIES = [
  { icon: Zap, label: 'Getting Started', desc: 'Account setup, first project, onboarding' },
  { icon: Globe, label: 'Campaign Generation', desc: 'How AI builds your campaigns' },
  { icon: CreditCard, label: 'Billing & Plans', desc: 'Subscriptions, upgrades, invoices' },
  { icon: Shield, label: 'Security & Privacy', desc: 'Data handling, account safety' },
]

const FAQS = [
  {
    q: 'How does AdPilot AI generate campaigns?',
    a: 'You provide a website URL, business goal, budget, and target platforms. Our AI crawls your site, analyzes your business and competitors, then generates a complete campaign strategy — including keywords, ad copy, audience targeting, and creative concepts — tailored to each advertising platform you select.',
  },
  {
    q: 'Which ad platforms are supported?',
    a: 'Google Search Ads, Google Shopping, Performance Max, Demand Gen, Meta (Facebook/Instagram), LinkedIn Ads, and YouTube Ads. Free plans include Google and Meta; Pro and Agency plans unlock all platforms.',
  },
  {
    q: 'Are the performance forecasts guaranteed?',
    a: 'No. Forecasts (CPC, CTR, ROAS, etc.) are AI-generated estimates based on industry benchmarks for your business category and goal. They are meant to help with planning, not as a guarantee of actual ad performance.',
  },
  {
    q: 'Can I export campaigns to upload directly into Google Ads or Meta Ads Manager?',
    a: 'Yes — every generated campaign includes a CSV export formatted with platform-appropriate fields (match types, character limits, audience segments) that you can use as a reference when building campaigns in each platform\'s native editor.',
  },
  {
    q: 'How many projects can I create on the Free plan?',
    a: 'The Free plan includes 3 projects with Google and Meta campaign generation. Pro and Agency plans include unlimited projects and access to every platform and feature.',
  },
  {
    q: 'How do I cancel my subscription?',
    a: 'Go to Settings → Subscription, or email support@adpilot.ai. Cancellations take effect at the end of your current billing period — you keep full access until then.',
  },
  {
    q: 'Can I add team members to collaborate on projects?',
    a: 'Team member access is available on the Agency plan. You can invite teammates from the Team page and assign Admin, Member, or Viewer roles.',
  },
  {
    q: 'Is my website and business data kept private?',
    a: 'Yes. Your project data is isolated per account using database-level security (Row Level Security), and is never shared with other AdPilot AI users. See our Privacy Policy for full details on how data is processed.',
  },
]

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [search, setSearch] = useState('')

  const filteredFaqs = FAQS.filter(
    f => f.q.toLowerCase().includes(search.toLowerCase()) ||
         f.a.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-6 h-6 text-brand-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">How can we help?</h1>
        <p className="text-gray-500">Search our help center or reach out to the team directly.</p>

        <div className="relative max-w-md mx-auto mt-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>
      </div>

      {/* Contact options */}
      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        <a
          href="mailto:support@adpilot.ai"
          className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 hover:border-brand-200 hover:shadow-sm transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
            <Mail className="w-5 h-5 text-brand-500" />
          </div>
          <div>
            <div className="font-medium text-gray-900">Email Support</div>
            <div className="text-sm text-gray-500 mt-0.5">support@adpilot.ai · Response within 24h</div>
          </div>
        </a>
        <div className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-5 h-5 text-violet-500" />
          </div>
          <div>
            <div className="font-medium text-gray-900">Priority Support</div>
            <div className="text-sm text-gray-500 mt-0.5">Available on Pro &amp; Agency plans</div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-12">
        <h2 className="font-semibold text-gray-900 mb-4">Browse by topic</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {CATEGORIES.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
              <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-900">{label}</div>
                <div className="text-xs text-gray-400">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div>
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Book className="w-4 h-4 text-gray-400" />
          Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          {filteredFaqs.map((faq, i) => (
            <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-900">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-sm text-gray-500 leading-relaxed">{faq.a}</div>
              )}
            </div>
          ))}
          {filteredFaqs.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">
              No articles match &ldquo;{search}&rdquo;. Try a different search or{' '}
              <a href="mailto:support@adpilot.ai" className="text-brand-600 hover:underline">email us</a>.
            </p>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 p-6 bg-brand-50 rounded-2xl text-center">
        <p className="text-sm text-brand-800 mb-3">Still need help? Our team is happy to assist.</p>
        <a
          href="mailto:support@adpilot.ai"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          <Mail className="w-4 h-4" />
          Contact Support
        </a>
      </div>
    </div>
  )
}
