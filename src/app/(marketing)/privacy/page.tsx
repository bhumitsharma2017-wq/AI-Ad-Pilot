import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — AdPilot AI',
  description: 'How AdPilot AI collects, uses, and protects your data.',
}

const LAST_UPDATED = 'June 1, 2026'

export default function PrivacyPage() {
  return (
    <article className="prose prose-gray max-w-none">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-10">Last updated: {LAST_UPDATED}</p>

      <div className="space-y-8 text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Introduction</h2>
          <p>
            AdPilot AI (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) provides an AI-powered
            performance marketing platform. This Privacy Policy explains what information we collect,
            how we use it, and the choices you have. By using AdPilot AI, you agree to the collection
            and use of information as described here.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Information We Collect</h2>
          <p className="mb-2"><strong>Account information:</strong> name, email address, company name, and
            authentication data (including Google OAuth profile data if you sign in with Google).</p>
          <p className="mb-2"><strong>Project data:</strong> website URLs you submit for analysis, business
            goals, budgets, target countries, and the AI-generated outputs derived from them (business
            analysis, competitor research, campaigns, creatives, reports).</p>
          <p className="mb-2"><strong>Payment information:</strong> billing details are processed by Razorpay;
            we do not store full payment card numbers on our servers.</p>
          <p><strong>Usage data:</strong> feature usage, API call volume, and approximate token consumption,
            used for plan enforcement and product improvement.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">3. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To provide, operate, and maintain the AdPilot AI platform</li>
            <li>To generate AI-powered campaign analysis, strategy, and creative content on your behalf</li>
            <li>To process subscription payments and manage your account plan</li>
            <li>To send important service updates, security alerts, and (with consent) product announcements</li>
            <li>To monitor and improve platform performance, reliability, and AI output quality</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Third-Party Processors</h2>
          <p className="mb-2">
            We share data with the following processors strictly to deliver the service:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Supabase</strong> — database, authentication, and storage infrastructure</li>
            <li><strong>OpenAI</strong> and <strong>Anthropic</strong> — AI processing of the website and
              business data you submit, used to generate campaign content</li>
            <li><strong>Razorpay</strong> — subscription billing and payment processing</li>
            <li><strong>Vercel</strong> — application hosting</li>
          </ul>
          <p className="mt-2">
            Each processor only receives the minimum data necessary to perform its function and is
            bound by its own data protection obligations.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Data Retention</h2>
          <p>
            We retain your account and project data for as long as your account is active. If you delete
            a project, its associated analysis, campaigns, and creative assets are permanently removed
            from our active database. You may request full account deletion at any time by contacting
            support.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Your Rights</h2>
          <p className="mb-2">Depending on your jurisdiction, you may have the right to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your account and associated data</li>
            <li>Export your project data</li>
            <li>Withdraw consent for marketing communications at any time</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Data Security</h2>
          <p>
            We use industry-standard safeguards including encryption in transit (TLS), Row Level
            Security at the database layer, and restricted access to production systems. No method of
            transmission or storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">8. Cookies</h2>
          <p>
            We use essential cookies for authentication and session management. We do not use
            third-party advertising cookies or sell visitor data to ad networks.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">9. Children&apos;s Privacy</h2>
          <p>
            AdPilot AI is intended for business use by individuals 18 years or older. We do not
            knowingly collect information from children.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Material changes will be communicated
            via email or an in-app notice before they take effect.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">11. Contact Us</h2>
          <p>
            Questions about this policy or your data can be sent to{' '}
            <a href="mailto:privacy@adpilot.ai" className="text-brand-600 hover:underline">
              privacy@adpilot.ai
            </a>.
          </p>
        </section>
      </div>
    </article>
  )
}
