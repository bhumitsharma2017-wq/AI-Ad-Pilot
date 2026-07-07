import type { CompetitorAnalysis } from '@/types'
import { Search, TrendingUp, AlertTriangle, Lightbulb, ExternalLink } from 'lucide-react'

interface Props {
  analysis: CompetitorAnalysis
}

export default function CompetitorAnalysisCard({ analysis }: Props) {
  return (
    <div className="space-y-6">
      {/* Market positioning */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-brand-500" />
          Market Positioning Strategy
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">{analysis.market_positioning}</p>
      </div>

      {/* Competitors grid */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Top Competitors</h3>
        <div className="space-y-3">
          {analysis.competitors.map((comp, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">#{i + 1}</span>
                    <h4 className="font-semibold text-gray-900">{comp.name}</h4>
                    <a
                      href={`https://${comp.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-brand-500 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{comp.positioning}</p>
                </div>
                <div className="flex flex-wrap gap-1 ml-4">
                  {comp.ad_channels?.map((ch, j) => (
                    <span key={j} className="px-2 py-0.5 bg-gray-50 text-gray-500 text-xs rounded-full border border-gray-200">
                      {ch}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <div className="text-xs text-gray-500 mb-1">KEY MESSAGE</div>
                <div className="text-sm text-gray-700 italic">"{comp.messaging}"</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs font-medium text-green-600 mb-1.5">STRENGTHS</div>
                  {comp.strengths?.map((s, j) => (
                    <div key={j} className="flex items-start gap-1.5 text-xs text-gray-600 mb-1">
                      <div className="w-1 h-1 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                      {s}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-xs font-medium text-red-500 mb-1.5">WEAKNESSES</div>
                  {comp.weaknesses?.map((w, j) => (
                    <div key={j} className="flex items-start gap-1.5 text-xs text-gray-600 mb-1">
                      <div className="w-1 h-1 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                      {w}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gaps & Opportunities */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Market Gaps to Exploit
          </h3>
          <div className="space-y-2">
            {analysis.gap_analysis.map((gap, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-600 p-2.5 bg-amber-50 rounded-lg">
                <span className="text-amber-500 font-bold text-xs flex-shrink-0 mt-0.5">{i + 1}.</span>
                {gap}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-brand-500" />
            Opportunities
          </h3>
          <div className="space-y-2">
            {analysis.opportunities.map((opp, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-600 p-2.5 bg-brand-50 rounded-lg">
                <span className="text-brand-500 font-bold text-xs flex-shrink-0 mt-0.5">{i + 1}.</span>
                {opp}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
