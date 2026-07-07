import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — AdPilot AI',
  description: 'Terms and conditions for using AdPilot AI.',
}

const LAST_UPDATED = 'June 1, 2026'

export default function TermsPage() {
  return (
    <article className="prose prose-gray max-w-none">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
      <p className="text-sm text-gray-400 mb-10">Last updated: {LAST_UPDATED}</p>

      <div className="space-y-8 text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h2>
          <p>
            By creating an account or using AdPilot AI (the &ldquo;Service&rdquo;), you agree to be
            bound by these Terms of Service. If you are using the Service on behalf of a company or
            agency, you represent that you have the authority to bind that organization to these terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Description of Service</h2>
          <p>
            AdPilot AI is an AI-powered performance marketing platform that analyzes websites, generates
            competitor research, and produces advertising campaign content (including but not limited to
            ad copy, keywords, audience targeting, and creative concepts) for use on third-party
            advertising platforms such as Google Ads, Meta, LinkedIn, and YouTube.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">3. AI-Generated Content</h2>
          <p className="mb-2">
            AdPilot AI uses third-party large language models to generate campaign strategies, ad copy,
            forecasts, and other content. You acknowledge and agree that:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>AI-generated content may contain inaccuracies and should be reviewed before use</li>
            <li>Performance forecasts (CPC, CTR, ROAS, etc.) are estimates based on general industry
              benchmarks, not guarantees of actual advertising performance</li>
            <li>You are solely responsible for reviewing generated ad copy for compliance with the
              advertising policies of each platform (Google, Meta, LinkedIn, YouTube) before publishing</li>
            <li>You are responsible for ensuring generated content does not infringe third-party
              intellectual property or violate applicable advertising law in your target market</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Account Responsibilities</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for
            all activity under your account. Notify us immediately of any unauthorized use.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Subscription Plans &amp; Billing</h2>
          <p className="mb-2">
            AdPilot AI offers Free, Pro, and Agency subscription tiers. Paid subscriptions are billed in
            advance on a recurring basis (monthly or yearly) through Razorpay and automatically renew
            until cancelled.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>You may cancel your subscription at any time; access continues until the end of the
              current billing period</li>
            <li>Fees are non-refundable except where required by applicable law</li>
            <li>We reserve the right to change subscription pricing with 30 days&apos; notice to active
              subscribers</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Acceptable Use</h2>
          <p className="mb-2">You agree not to use the Service to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Generate content for illegal products, services, or advertising practices</li>
            <li>Analyze or scrape websites you do not have authorization to assess</li>
            <li>Reverse-engineer, resell, or white-label the underlying AI prompts or system architecture</li>
            <li>Attempt to circumvent plan limits, rate limits, or usage restrictions</li>
            <li>Use the Service to generate spam, deceptive, or fraudulent advertising content</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Intellectual Property</h2>
          <p>
            You retain ownership of the website content and business information you submit. AI-generated
            campaign content produced for your projects is licensed to you for use in your own advertising
            campaigns. AdPilot AI retains all rights to the platform, underlying software, and system
            prompts.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">8. Disclaimer of Warranties</h2>
          <p>
            The Service is provided &ldquo;as is&rdquo; without warranties of any kind, express or
            implied. We do not warrant that AI-generated forecasts or campaign recommendations will
            result in any particular advertising outcome, return on ad spend, or business result.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, AdPilot AI shall not be liable for any indirect,
            incidental, special, or consequential damages, including lost advertising spend, lost
            profits, or lost data, arising from your use of the Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">10. Termination</h2>
          <p>
            We may suspend or terminate your access to the Service if you violate these Terms. You may
            terminate your account at any time from Settings.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">11. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of the Service after changes take
            effect constitutes acceptance of the revised Terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">12. Contact</h2>
          <p>
            Questions about these Terms can be sent to{' '}
            <a href="mailto:legal@adpilot.ai" className="text-brand-600 hover:underline">
              legal@adpilot.ai
            </a>.
          </p>
        </section>
      </div>
    </article>
  )
}
