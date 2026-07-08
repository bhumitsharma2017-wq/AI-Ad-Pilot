# AdPilot AI — AI-Powered Performance Marketing Manager

> Replace your junior PPC team with AI. Generate complete campaign blueprints across Google, Meta, LinkedIn & YouTube in minutes.

---

## 🚀 What's Built

A production-ready SaaS platform with:

- **AI Website Analysis** — Crawls your site, extracts USPs, audience, features, objections
- **Competitor Intelligence** — Identifies top 5 competitors with messaging & gap analysis
- **Multi-Platform Campaign Builder** — Google, Meta, LinkedIn, YouTube, Shopping, Demand Gen
- **Creative Studio** — Image concepts, copy variations, video scripts
- **Landing Page Audit** — CRO scoring + actionable recommendations
- **Performance Forecasting** — CPC, CTR, ROAS, CPL projections
- **Client Reports** — AI-generated weekly/monthly/quarterly reports with PDF/PPT export
- **Razorpay Subscriptions** — Free, Pro (₹2,999/mo), Agency (₹7,999/mo)
- **Role-Based Access** — Free / Pro / Agency / Admin
- **Admin Panel** — User management, revenue dashboard, API usage

---

## 📁 Folder Structure

```
adpilot-ai/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Login, Signup, Forgot Password
│   │   ├── (marketing)/         # Privacy, Terms, Support — public legal/help pages
│   │   ├── (dashboard)/         # All dashboard pages
│   │   │   ├── dashboard/       # Main dashboard
│   │   │   ├── projects/        # Project list + detail
│   │   │   │   └── [id]/        # Project detail with tabs
│   │   │   ├── campaign-generator/
│   │   │   ├── competitor-analysis/
│   │   │   ├── creative-studio/ # Pro/Agency gated
│   │   │   ├── landing-audit/
│   │   │   ├── reports/         # Pro/Agency gated
│   │   │   ├── subscription/
│   │   │   ├── settings/
│   │   │   ├── team/            # Agency-only team management
│   │   │   └── admin/
│   │   ├── onboarding/          # First-run wizard for new users
│   │   ├── api/
│   │   │   ├── ai/
│   │   │   │   ├── analyze/     # Main AI analysis pipeline
│   │   │   │   ├── audit/       # Landing page audit
│   │   │   │   └── creative/    # Creative generation
│   │   │   ├── campaigns/
│   │   │   │   └── generate/    # Campaign generation (all platforms)
│   │   │   ├── projects/        # REST CRUD for projects
│   │   │   ├── users/me/        # Profile + usage stats
│   │   │   ├── team/invite/     # Agency team invites
│   │   │   ├── reports/
│   │   │   │   ├── generate/    # Report generation
│   │   │   │   └── export/      # PDF/PPT export
│   │   │   ├── export/
│   │   │   │   └── campaign/    # Per-platform CSV export
│   │   │   └── webhooks/
│   │   │       ├── subscribe/   # Create Razorpay subscription
│   │   │       └── razorpay/    # Webhook handler (idempotent)
│   │   ├── auth/callback/       # OAuth callback
│   │   ├── layout.tsx, page.tsx, globals.css
│   │   ├── not-found.tsx, global-error.tsx
│   │   └── sitemap.ts, robots.ts
│   ├── components/
│   │   ├── ui/                  # Button, Card, Modal, Tabs, Badge, Input, etc.
│   │   ├── layout/               # Sidebar (collapsible), TopBar (generation indicator)
│   │   ├── shared/               # PageHeader, UpgradePrompt
│   │   ├── onboarding/           # OnboardingWizard
│   │   ├── analysis/             # BusinessAnalysis/Competitor/Strategy/LandingAudit cards
│   │   ├── campaigns/            # Google/Meta/LinkedIn/YouTube/Ecommerce/DemandGen views
│   │   └── forecasting/          # ForecastCard
│   ├── lib/
│   │   ├── ai/engine.ts          # Core AI functions (GPT-4o + Claude)
│   │   ├── ai/demandgen.ts       # Demand Gen + Performance Max generators
│   │   ├── supabase/client.ts    # Browser + Server + Admin clients
│   │   ├── razorpay/client.ts    # Razorpay utilities
│   │   ├── export/index.ts       # CSV generation per platform
│   │   └── utils/index.ts        # Formatting, plan-gating, shared helpers
│   ├── hooks/index.ts            # useUser, useProjects, useProject (realtime), etc.
│   ├── store/index.ts            # Zustand: useAppStore, useGenerationStore
│   ├── middleware.ts             # Auth guards, admin routes, security headers
│   └── types/index.ts            # All TypeScript types
├── scripts/seed.ts               # Demo data seeder for local dev
├── supabase/schema.sql           # Complete DB schema with RLS
├── Dockerfile, docker-compose.yml, .dockerignore
├── .github/workflows/ci.yml      # Lint + type-check + build on push/PR
├── ARCHITECTURE.md               # Design decisions & extension guide
├── .env.example
└── README.md
```

---

## 🔧 Setup Instructions

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd adpilot-ai
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env.local
```

Fill in all values in `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# OpenAI
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o

# Anthropic (for reports)
ANTHROPIC_API_KEY=sk-ant-...

# Razorpay
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...

# Optional: Website crawling (better analysis)
FIRECRAWL_API_KEY=fc-...
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor
3. Run the entire contents of `supabase/schema.sql`
4. Enable Google OAuth in Authentication → Providers
5. Set Redirect URL: `https://yourapp.vercel.app/auth/callback`

### 4. Set Up Razorpay

1. Create account at [razorpay.com](https://razorpay.com)
2. Create two subscription plans in Dashboard → Products → Plans:
   - **Pro Monthly**: ₹2,999/month
   - **Agency Monthly**: ₹7,999/month
3. Copy Plan IDs to `.env.local`:
   ```env
   RAZORPAY_PRO_MONTHLY_PLAN_ID=plan_xxxxx
   RAZORPAY_AGENCY_MONTHLY_PLAN_ID=plan_xxxxx
   ```
4. Set webhook URL: `https://yourapp.vercel.app/api/webhooks/razorpay`
5. Subscribe to events: `subscription.activated`, `subscription.cancelled`, `subscription.charged`

### 5. (Optional) Seed Demo Data

Populate a demo account with a fully-analyzed sample project so you can explore the UI without spending AI API credits:

```bash
npm run seed
```

This creates `demo@adpilot.ai` / `DemoPassword123!` on Pro plan with a complete project (business analysis, competitor research, strategy, forecasts, and a generated Google Ads campaign).

### 6. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 🐳 Alternative: Run with Docker

If you'd rather not deploy to Vercel, a multi-stage `Dockerfile` and `docker-compose.yml` are included:

```bash
cp .env.example .env
# fill in .env, then:
docker compose up --build
```

The app will be available at `http://localhost:3000`. The Dockerfile uses Next.js's `output: 'standalone'` mode for a minimal production image.

---

## 🚀 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env pull
```

Or connect your GitHub repo to Vercel for automatic deployments.

**Required Vercel Settings:**
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Add all env vars in Vercel Dashboard → Settings → Environment Variables

---

## 🗄️ Database Schema Overview

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles (extends auth.users) |
| `subscriptions` | Plan & Razorpay subscription data |
| `projects` | User projects with all AI analysis |
| `campaigns` | Generated campaigns per platform |
| `creative_assets` | Stored creative concepts |
| `reports` | Generated reports |
| `team_members` | Agency team access |
| `usage_logs` | API usage tracking |
| `payment_events` | Razorpay webhook logs |

---

## 🤖 AI Architecture

```
User Input (URL + Goal + Budget)
        │
        ▼
┌─────────────────────┐
│  Website Analysis   │ → GPT-4o → Business profile
│  (analyzeWebsite)   │
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ Competitor Analysis │ → GPT-4o → Top 5 competitors + gaps
│(analyzeCompetitors) │
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ Campaign Strategy   │ → GPT-4o → Budget allocation + funnel
│(generateStrategy)   │
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ Campaign Builders   │ → GPT-4o (per platform)
│ Google / Meta /     │
│ LinkedIn / YouTube  │
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│   Report Writer     │ → Claude Sonnet → Professional reports
│  (generateReport)   │
└─────────────────────┘
```

**Why GPT-4o for campaigns + Claude for reports?**
- GPT-4o: Better JSON structured output, faster for data extraction
- Claude: Superior long-form writing quality for client reports

---

## 💳 Subscription Flow

```
User clicks Upgrade
      │
      ▼
POST /api/webhooks/subscribe
      │ Creates Razorpay customer + subscription
      ▼
Razorpay Checkout opens (client-side)
      │ User completes payment
      ▼
POST /api/webhooks/razorpay (webhook)
      │ subscription.activated event
      │ Updates DB: plan, role, period
      ▼
User has Pro/Agency access
```

---

## 🔐 Security

- **Row Level Security** on all Supabase tables
- **Service Role Key** only used server-side (never exposed)
- **Razorpay webhook signature** verification
- **Session-based auth** via Supabase SSR
- **Rate limiting** recommended via Vercel middleware

---

## 🔌 Adding New AI Agents

The modular architecture makes it easy to add new capabilities:

```typescript
// src/lib/ai/engine.ts
export async function generateNewAgent(input: GenerateCampaignInput) {
  const prompt = `Your agent-specific prompt...`
  const response = await openai.chat.completions.create({...})
  return JSON.parse(response.choices[0].message.content || '{}')
}
```

Then add it to:
1. `src/app/api/campaigns/generate/route.ts` — GENERATORS map
2. `src/components/campaigns/` — New view component
3. `src/components/campaigns/CampaignsList.tsx` — Import and register

---

## 📊 Monetization

| Plan | Price | Projects | Team | AI Calls/mo |
|------|-------|----------|------|-------------|
| Free | ₹0 | 3 | 1 | ~50 |
| Pro | ₹2,999 | ∞ | 3 | ∞ |
| Agency | ₹7,999 | ∞ | ∞ | ∞ |

**Revenue at scale:**
- 100 Pro users = ₹2,99,900/mo
- 50 Agency users = ₹3,99,950/mo

---

## 📞 Support

- Email: support@adpilot.ai
- Docs: docs.adpilot.ai
- GitHub Issues: [your-repo/issues]

---

Built with ❤️ using Next.js 15, Supabase, OpenAI GPT-4o, Anthropic Claude, and Razorpay.
