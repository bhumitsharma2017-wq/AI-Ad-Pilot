'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, Target, Globe, DollarSign, ArrowRight, CheckCircle, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'

const STEPS = [
  { id: 1, title: 'Welcome', icon: Sparkles },
  { id: 2, title: 'Your Business', icon: Building2 },
  { id: 3, title: 'First Project', icon: Target },
  { id: 4, title: 'Done!', icon: CheckCircle },
]

interface OnboardingData {
  fullName: string
  companyName: string
  role: string
  websiteUrl: string
  goal: string
  budget: string
  country: string
  platforms: string[]
}

const GOALS = [
  { value: 'lead_generation', label: 'Lead Generation', emoji: '🎯' },
  { value: 'ecommerce_sales', label: 'Ecommerce Sales', emoji: '🛒' },
  { value: 'app_installs', label: 'App Installs', emoji: '📱' },
  { value: 'brand_awareness', label: 'Brand Awareness', emoji: '📢' },
  { value: 'website_traffic', label: 'Website Traffic', emoji: '🌐' },
]

const ROLES = [
  'Marketing Manager', 'Founder/CEO', 'Digital Marketing Agency',
  'Freelancer', 'E-commerce Manager', 'Growth Manager', 'Other',
]

const PLATFORMS = ['google', 'meta', 'linkedin', 'youtube']

export default function OnboardingWizard({ userId }: { userId: string }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<OnboardingData>({
    fullName: '', companyName: '', role: '', websiteUrl: '',
    goal: 'lead_generation', budget: '5000', country: 'India', platforms: ['google', 'meta'],
  })
  const router = useRouter()
  const supabase = createClient()

  const update = (key: keyof OnboardingData, value: string | string[]) =>
    setData(prev => ({ ...prev, [key]: value }))

  const togglePlatform = (p: string) => {
    update('platforms', data.platforms.includes(p)
      ? data.platforms.filter(x => x !== p)
      : [...data.platforms, p]
    )
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      // Update profile
      await supabase.from('profiles').update({
        full_name: data.fullName,
        company_name: data.companyName,
        onboarding_completed: true,
      }).eq('id', userId)

      // Create first project
      const url = data.websiteUrl.startsWith('http') ? data.websiteUrl : `https://${data.websiteUrl}`
      const { data: project } = await supabase.from('projects').insert({
        user_id: userId,
        name: new URL(url).hostname.replace('www.', ''),
        website_url: url,
        business_goal: data.goal,
        monthly_budget: parseFloat(data.budget),
        target_country: data.country,
        platforms: data.platforms,
        status: 'analyzing',
      }).select().single()

      if (project) {
        // Trigger AI analysis
        fetch('/api/ai/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ project_id: project.id }),
        })
        setStep(4)
        setTimeout(() => router.push(`/projects/${project.id}`), 2500)
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                step >= s.id ? 'text-brand-600' : 'text-gray-400'
              }`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step > s.id ? 'bg-brand-600 text-white' :
                  step === s.id ? 'bg-brand-100 text-brand-600 ring-2 ring-brand-500' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {step > s.id ? '✓' : s.id}
                </div>
                <span className="hidden sm:block">{s.title}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`mx-2 flex-1 h-0.5 w-8 transition-colors ${step > s.id ? 'bg-brand-300' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 animate-fade-in">
          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center mx-auto mb-5">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to AdPilot AI</h1>
              <p className="text-gray-500 mb-6">
                Let's set up your account and create your first AI-powered campaign blueprint in under 2 minutes.
              </p>
              <div className="space-y-3 mb-8 text-left">
                {[
                  'AI analyzes your website automatically',
                  'Identifies your top competitors',
                  'Builds complete campaigns across all platforms',
                ].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-brand-500 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: About You */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Tell us about yourself</h2>
              <p className="text-gray-500 text-sm mb-6">We'll personalise your experience.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={data.fullName}
                    onChange={e => update('fullName', e.target.value)}
                    placeholder="Jane Smith"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Company / Brand</label>
                  <input
                    type="text"
                    value={data.companyName}
                    onChange={e => update('companyName', e.target.value)}
                    placeholder="Acme Corp"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Role</label>
                  <div className="flex flex-wrap gap-2">
                    {ROLES.map(role => (
                      <button
                        key={role}
                        onClick={() => update('role', role)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                          data.role === role
                            ? 'border-brand-500 bg-brand-50 text-brand-700 font-medium'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Back</button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!data.fullName}
                  className="flex-1 py-2.5 bg-brand-600 text-white rounded-xl font-medium text-sm hover:bg-brand-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: First Project */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Set up your first project</h2>
              <p className="text-gray-500 text-sm mb-5">Enter your website — AI will do the rest.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Website URL *</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={data.websiteUrl}
                      onChange={e => update('websiteUrl', e.target.value)}
                      placeholder="yourcompany.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Goal</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {GOALS.map(({ value, label, emoji }) => (
                      <button
                        key={value}
                        onClick={() => update('goal', value)}
                        className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-xs font-medium transition-all ${
                          data.goal === value
                            ? 'border-brand-500 bg-brand-50 text-brand-700'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-lg">{emoji}</span>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Monthly Budget (USD)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        value={data.budget}
                        onChange={e => update('budget', e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
                    <select
                      value={data.country}
                      onChange={e => update('country', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
                    >
                      {['India', 'United States', 'United Kingdom', 'Australia', 'Canada', 'Singapore', 'UAE'].map(c => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platforms</label>
                  <div className="flex gap-2">
                    {PLATFORMS.map(p => (
                      <button
                        key={p}
                        onClick={() => togglePlatform(p)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium capitalize transition-all ${
                          data.platforms.includes(p)
                            ? 'border-brand-500 bg-brand-50 text-brand-700'
                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(2)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Back</button>
                <button
                  onClick={handleComplete}
                  disabled={!data.websiteUrl || loading}
                  className="flex-1 py-2.5 bg-brand-600 text-white rounded-xl font-medium text-sm hover:bg-brand-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? 'Creating...' : <><Sparkles className="w-4 h-4" /> Generate My First Campaign</>}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Done */}
          {step === 4 && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">You're all set! 🎉</h2>
              <p className="text-gray-500 text-sm">
                AI is analyzing your website now. Redirecting to your project...
              </p>
              <div className="flex items-center justify-center gap-1.5 mt-4">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-brand-400" style={{ animation: `pulse 1.2s ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
