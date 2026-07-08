# Architecture Guide

This document explains the key architectural decisions in AdPilot AI so new contributors (human or AI) can navigate and extend the codebase confidently.

---

## Why Next.js App Router?

- **Server Components by default** — project list, dashboard stats, and admin panel fetch data server-side with no client-side loading spinners on first paint.
- **Route groups** `(auth)` and `(dashboard)` separate layouts without affecting the URL structure.
- **Server Actions + API Routes mix** — API routes are used (not Server Actions) for anything that needs to be called from `fetch()` with custom polling/loading UI, since campaign generation can take 20-90 seconds and benefits from explicit loading states.

## Why split AI generation into separate functions per platform?

Each platform (`generateGoogleAdsCampaign`, `generateMetaAdsCampaign`, etc.) has wildly different output schemas — Google needs match-type keywords and character-limited headlines, Meta needs primary texts and audience signals, YouTube needs scene-by-scene scripts. Combining them into one mega-prompt produces worse output than focused, platform-specific prompts. The `GENERATORS` map in `/api/campaigns/generate/route.ts` makes adding a new platform a 3-step process:

1. Write `generateXAdsCampaign()` in `src/lib/ai/engine.ts` (or a new file like `demandgen.ts`)
2. Register it in the `GENERATORS` map
3. Create a `XCampaignView.tsx` component and register it in `CampaignsList.tsx`'s `VIEW_MAP`

## Why GPT-4o for campaigns, Claude for reports?

- **GPT-4o** with `response_format: { type: 'json_object' }` gives highly reliable structured JSON output — critical for campaign data that gets rendered into specific UI fields (headlines array, keyword match types, etc.)
- **Claude (Sonnet)** is used for the report-writing function because long-form prose quality matters more there than strict JSON structure, and report content is rendered as formatted text/HTML, not mapped to UI fields.

This is a deliberate "right tool for the job" split, not a vendor preference.

## Data model: why store AI output as JSONB?

Project analysis (`business_analysis`, `competitor_analysis`, etc.) and campaign data (`structure`, `ad_copy`, `keywords`, etc.) are stored as `JSONB` columns rather than normalized tables. This is intentional:

- AI output schemas evolve as prompts improve — JSONB avoids constant migrations
- Each platform's campaign shape is fundamentally different (Google has `ad_groups`, Meta has `ad_sets`) — a single normalized schema would require dozens of nullable columns or a complex EAV pattern
- Read patterns are "fetch one project, render everything" — there's no need to query *across* the JSON content with SQL

If you later need to query inside this JSON (e.g., "find all campaigns using keyword X"), Postgres JSONB supports indexed queries (`@>`, `->>`) without a schema change.

## Why Zustand instead of React Context or Redux?

- No boilerplate providers wrapping the tree
- `persist` middleware handles localStorage sync for UI preferences (theme, sidebar state) with one line
- The app doesn't need time-travel debugging or complex middleware chains that justify Redux's overhead

Two stores exist by design:
- `useAppStore` — persisted UI/profile state
- `useGenerationStore` — ephemeral, session-only campaign generation progress (never persisted, since "in progress" state shouldn't survive a refresh)

## Why Supabase over a custom Postgres + Auth setup?

- RLS (Row Level Security) policies in `schema.sql` enforce data isolation at the database level — even if an API route has a bug, a user literally cannot query another user's projects
- Built-in OAuth (Google) without managing OAuth flows manually
- Realtime subscriptions (used in `useProject` hook) push analysis completion to the UI without polling — though polling is used as a fallback in `ProjectDetailPage` for simplicity/reliability

## Three Supabase client variants — when to use which

| Client | File | Use when |
|---|---|---|
| `createClient()` | Browser | Client components, React hooks, anything in `'use client'` files |
| `createServerSupabaseClient()` | Server | Server Components, respects the user's session/RLS |
| `createAdminClient()` | Server only | API routes that need to bypass RLS (e.g., checking subscription limits, writing AI results) — **never expose this client or its key to the browser** |

## Subscription & plan-gating pattern

Plan checks happen in **two places** by design:

1. **API routes** (source of truth) — e.g., `/api/campaigns/generate` checks `subscription.plan` before allowing LinkedIn/YouTube generation
2. **UI components** (`UpgradePrompt`, `hasFeatureAccess()` in `lib/utils`) — for a good UX (showing an upgrade prompt instead of a generic error), but never trusted as the actual security boundary

If you add a new paid feature, gate it in the API route first; the UI gate is a convenience layer only.

## Webhook idempotency

`payment_events` table stores every Razorpay webhook event by `event_id` before processing. This prevents double-processing if Razorpay retries a webhook delivery (which it does on non-200 responses) — see `/api/webhooks/razorpay/route.ts`.

## Adding a new AI agent/module checklist

1. Define the output TypeScript type in `src/types/index.ts`
2. Write the generator function in `src/lib/ai/` (new file if it's a new domain, or add to `engine.ts`)
3. Add a column to the relevant table in `supabase/schema.sql` (or reuse an existing JSONB column)
4. Create an API route or extend an existing one
5. Build the UI card/view component
6. Wire up plan-gating if it's a Pro/Agency feature (`hasFeatureAccess`, `UpgradePrompt`)
7. Add usage logging (`usage_logs` insert) for cost tracking
