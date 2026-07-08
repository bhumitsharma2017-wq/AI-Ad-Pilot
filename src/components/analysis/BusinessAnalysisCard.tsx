import type { BusinessAnalysis } from '@/types'
import { CheckCircle, Target, Users, AlertTriangle } from 'lucide-react'

interface Props {
  analysis: BusinessAnalysis
}

export default function BusinessAnalysisCard({ analysis }: Props) {
  return (
    <div className="space-y-6">
      {/* Summary header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
            <Target className="w-6 h-6 text-brand-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{analysis.company_name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2.5 py-0.5 bg-brand-50 text-brand-600 text-xs rounded-full font-medium">
                {analysis.business_category}
              </span>
            </div>
          </div>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">{analysis.summary}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Products & Services */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Products & Services
          </h3>
          <div className="space-y-2">
            {[...analysis.products, ...analysis.services].map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* USPs */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-brand-500" />
            Unique Selling Points
          </h3>
          <div className="space-y-2">
            {analysis.usp.map((usp, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-brand-400 font-bold text-xs mt-0.5 flex-shrink-0">0{i + 1}</span>
                {usp}
              </div>
            ))}
          </div>
        </div>

        {/* Target Audience */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-violet-500" />
            Target Audience
          </h3>
          <p className="text-sm text-gray-600 mb-3">{analysis.target_audience}</p>
          <div className="flex flex-wrap gap-1.5">
            {analysis.geographic_markets.map((m, i) => (
              <span key={i} className="px-2 py-1 bg-violet-50 text-violet-600 text-xs rounded-full">
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Pain Points & Objections */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Pain Points We Solve
          </h3>
          <div className="space-y-2 mb-4">
            {analysis.pain_points.slice(0, 4).map((p, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                {p}
              </div>
            ))}
          </div>
          <h4 className="text-xs font-medium text-gray-500 mb-2">COMMON OBJECTIONS</h4>
          {analysis.objections.slice(0, 3).map((o, i) => (
            <div key={i} className="text-sm text-gray-500 italic mb-1">&ldquo;{o}&rdquo;</div>
          ))}
        </div>
      </div>

      {/* Features */}
      {analysis.features?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Key Features</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.features.map((f, i) => (
              <span key={i} className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 text-sm rounded-lg">
                {f}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
