// ─── CSV Export Utilities ─────────────────────────────────────────────────────

export function objectsToCSV(
  objects: Record<string, unknown>[],
  columns?: { key: string; header: string }[]
): string {
  if (!objects.length) return ''

  const cols = columns || Object.keys(objects[0]).map(key => ({ key, header: key }))
  const headers = cols.map(c => `"${c.header}"`)
  const rows = objects.map(obj =>
    cols.map(c => {
      const val = obj[c.key]
      const str = val === null || val === undefined ? '' : String(val)
      return `"${str.replace(/"/g, '""')}"`
    })
  )

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
}

export function arrayToCSV(rows: string[][]): string {
  return rows
    .map(row => row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(','))
    .join('\n')
}

// ─── Google Ads CSV Format ─────────────────────────────────────────────────────
export function googleAdsCampaignToCSV(campaign: Record<string, unknown>): string {
  const rows: string[][] = []
  const adCopy = campaign.ad_copy as Record<string, unknown> || {}
  const keywords = campaign.keywords as Record<string, unknown> || {}
  const structure = campaign.structure as Record<string, unknown> || {}
  const settings = campaign.settings as Record<string, unknown> || {}

  rows.push(['AdPilot AI — Google Ads Campaign Export'])
  rows.push(['Generated:', new Date().toLocaleString()])
  rows.push([])

  // Campaign settings
  rows.push(['=== CAMPAIGN SETTINGS ==='])
  rows.push(['Campaign Name', String(structure.campaign_name || campaign.name || '')])
  rows.push(['Objective', String(structure.campaign_objective || '')])
  rows.push(['Bid Strategy', String(structure.bid_strategy || '')])
  rows.push(['Daily Budget ($)', String(structure.daily_budget || '')])
  rows.push(['Locations', ((settings.location_targeting as string[]) || []).join('; ')])
  rows.push(['Languages', ((settings.language_targeting as string[]) || []).join('; ')])
  rows.push(['Device Strategy', String(settings.device_strategy || '')])
  rows.push([])

  // Responsive Search Ad
  rows.push(['=== RESPONSIVE SEARCH AD ==='])
  rows.push(['Type', 'Headline', 'Characters', 'Status'])
  const headlines = (adCopy.headlines as string[]) || []
  headlines.forEach((h, i) => {
    const overLimit = h.length > 30
    rows.push([`Headline ${i + 1}`, h, String(h.length), overLimit ? 'OVER LIMIT' : 'OK'])
  })
  rows.push([])

  rows.push(['Type', 'Description', 'Characters', 'Status'])
  const descriptions = (adCopy.descriptions as string[]) || []
  descriptions.forEach((d, i) => {
    const overLimit = d.length > 90
    rows.push([`Description ${i + 1}`, d, String(d.length), overLimit ? 'OVER LIMIT' : 'OK'])
  })
  rows.push([])

  // Keywords
  rows.push(['=== KEYWORDS ==='])
  rows.push(['Match Type', 'Keyword'])
  ;((keywords.broad as string[]) || []).forEach(k => rows.push(['Broad Match', k]))
  ;((keywords.phrase as string[]) || []).forEach(k => rows.push(['Phrase Match', `"${k}"`]))
  ;((keywords.exact as string[]) || []).forEach(k => rows.push(['Exact Match', `[${k}]`]))
  rows.push([])

  rows.push(['=== NEGATIVE KEYWORDS ==='])
  rows.push(['Type', 'Keyword'])
  ;((keywords.negative as string[]) || []).forEach(k => rows.push(['Negative', k]))
  rows.push([])

  // Extensions
  if (adCopy.sitelinks) {
    rows.push(['=== SITELINK EXTENSIONS ==='])
    rows.push(['Title', 'Desc Line 1', 'Desc Line 2', 'Final URL'])
    ;((adCopy.sitelinks as Record<string, string>[]) || []).forEach(sl => {
      rows.push([sl.title || '', sl.description1 || '', sl.description2 || '', sl.url || ''])
    })
    rows.push([])
  }

  if (adCopy.callouts) {
    rows.push(['=== CALLOUT EXTENSIONS ==='])
    ;((adCopy.callouts as string[]) || []).forEach(c => rows.push([c]))
    rows.push([])
  }

  if (adCopy.structured_snippets) {
    rows.push(['=== STRUCTURED SNIPPETS ==='])
    rows.push(['Header', 'Values'])
    ;((adCopy.structured_snippets as Record<string, unknown>[]) || []).forEach(ss => {
      rows.push([String(ss.header || ''), ((ss.values as string[]) || []).join('; ')])
    })
    rows.push([])
  }

  // Audience signals
  if (keywords.audience_signals) {
    rows.push(['=== AUDIENCE SIGNALS ==='])
    ;((keywords.audience_signals as string[]) || []).forEach(a => rows.push([a]))
  }

  return arrayToCSV(rows)
}

// ─── Meta Ads Export ──────────────────────────────────────────────────────────
export function metaAdsCampaignToCSV(campaign: Record<string, unknown>): string {
  const rows: string[][] = []
  const adCopy = campaign.ad_copy as Record<string, unknown> || {}
  const audiences = campaign.audiences as Record<string, unknown> || {}
  const creatives = campaign.creatives as Record<string, unknown> || {}
  const structure = campaign.structure as Record<string, unknown> || {}

  rows.push(['AdPilot AI — Meta Ads Campaign Export'])
  rows.push(['Generated:', new Date().toLocaleString()])
  rows.push([])

  rows.push(['=== CAMPAIGN SETTINGS ==='])
  rows.push(['Campaign Name', String(structure.campaign_name || campaign.name || '')])
  rows.push(['Objective', String(structure.campaign_objective || 'LEADS')])
  rows.push(['Bid Strategy', String(structure.bid_strategy || 'LOWEST_COST')])
  rows.push(['Daily Budget ($)', String(structure.daily_budget || '')])
  rows.push([])

  rows.push(['=== PRIMARY TEXTS ==='])
  rows.push(['Variation #', 'Primary Text'])
  ;((adCopy.primary_texts as string[]) || []).forEach((t, i) => {
    rows.push([String(i + 1), t])
  })
  rows.push([])

  rows.push(['=== HEADLINES ==='])
  ;((adCopy.headlines as string[]) || []).forEach((h, i) => {
    rows.push([String(i + 1), h])
  })
  rows.push([])

  rows.push(['=== CTA OPTIONS ==='])
  ;((adCopy.cta_options as string[]) || []).forEach(c => rows.push([c]))
  rows.push([])

  rows.push(['=== INTEREST TARGETING ==='])
  ;((audiences.interest_targeting as string[]) || []).forEach(i => rows.push([i]))
  rows.push([])

  rows.push(['=== LOOKALIKE AUDIENCES ==='])
  ;((audiences.lookalike as string[]) || []).forEach(a => rows.push([a]))
  rows.push([])

  rows.push(['=== REMARKETING ==='])
  ;((audiences.remarketing as string[]) || []).forEach(a => rows.push([a]))
  rows.push([])

  rows.push(['=== CREATIVE ANGLES ==='])
  ;((creatives.creative_angles as string[]) || []).forEach((a, i) => rows.push([String(i + 1), a]))

  return arrayToCSV(rows)
}

// ─── Download trigger ─────────────────────────────────────────────────────────
export function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function downloadJSON(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
