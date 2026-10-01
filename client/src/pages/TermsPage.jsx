import { Link } from 'react-router-dom';

export default function TermsPage() {
  const lastUpdated = 'October 1, 2026';

  return (
    <div className="terms-page min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50/50 py-16 px-6 flex flex-col items-center">
      <header className="terms-header max-w-3xl flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200/60 mb-6 shadow-sm">
          ⚖️ Legal Information
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight text-center">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-500 mt-4 text-center">
          Last updated: {lastUpdated}
        </p>
      </header>

      <article className="terms-document w-full max-w-4xl mt-12 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 p-8 md:p-12 lg:p-16">
        <div className="space-y-8 text-gray-600 leading-relaxed">
          <p>
            Welcome to WebStructura. These Terms of Service (&quot;Terms&quot;)
            govern your access to and use of our website builder platform,
            websites, and related services (collectively, the &quot;Service&quot;).
            By creating an account or using the Service, you agree to these
            Terms. If you do not agree, do not use the Service.
          </p>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">
              1. Agreement to Terms
            </h2>
            <p>
              By accessing or using WebStructura, you confirm that you can form
              a binding contract with us, that you are at least 18 years old (or
              the age of majority in your jurisdiction), and that you will
              comply with these Terms and all applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">
              2. Accounts &amp; Eligibility
            </h2>
            <p>
              You are responsible for the accuracy of information you provide
              and for keeping your login credentials secure. You must notify us
              promptly of any unauthorized use of your account. We may suspend
              or terminate accounts that violate these Terms or pose a security
              risk.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Provide accurate registration and contact details</li>
              <li>Do not share account credentials with unauthorized users</li>
              <li>You are responsible for activity under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">
              3. Use of the Service
            </h2>
            <p>
              Subject to these Terms, we grant you a limited, non-exclusive,
              non-transferable right to use the Service to create, edit,
              preview, and manage website projects for lawful purposes.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Do not misuse the Service or attempt unauthorized access</li>
              <li>
                Do not upload unlawful, harmful, or infringing content
              </li>
              <li>
                Do not reverse engineer, scrape, or disrupt platform operations
              </li>
              <li>
                Do not use the Service to send spam or malware
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">
              4. Your Content
            </h2>
            <p>
              You retain ownership of content you submit to the Service
              (&quot;Your Content&quot;). You grant WebStructura a worldwide,
              royalty-free license to host, process, display, and back up Your
              Content solely as needed to operate and improve the Service. You
              represent that you have the rights necessary to submit Your
              Content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">
              5. Intellectual Property
            </h2>
            <p>
              The Service, including software, design systems, templates,
              branding, and documentation, is owned by WebStructura and its
              licensors. Except for Your Content and rights expressly granted
              here, no intellectual property rights are transferred to you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">
              6. AI Features
            </h2>
            <p>
              Some features may use local or third-party AI to draft copy or
              structure. AI output may be inaccurate or incomplete. You are
              solely responsible for reviewing, editing, and approving any
              AI-assisted content before publishing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">
              7. Subscriptions, Trials &amp; Billing
            </h2>
            <p>
              Paid plans, if offered, are billed according to the pricing and
              terms shown at checkout. Fees are generally non-refundable except
              where required by law. We may change pricing with reasonable
              notice for renewals.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">
              8. Disclaimers
            </h2>
            <p>
              The Service is provided &quot;as is&quot; and &quot;as
              available&quot; without warranties of any kind, whether express or
              implied, including merchantability, fitness for a particular
              purpose, and non-infringement. We do not warrant uninterrupted or
              error-free operation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">
              9. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, WebStructura and its
              affiliates will not be liable for indirect, incidental, special,
              consequential, or punitive damages, or any loss of profits, data,
              or goodwill arising from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">
              10. Termination
            </h2>
            <p>
              You may stop using the Service at any time. We may suspend or
              terminate access if you violate these Terms or if we discontinue
              the Service. Upon termination, your right to use the Service ends
              immediately, subject to any data export options we make available.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">
              11. Changes to These Terms
            </h2>
            <p>
              We may update these Terms from time to time. Material changes will
              be posted on this page with an updated &quot;Last updated&quot;
              date. Continued use of the Service after changes become effective
              constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">
              12. Contact
            </h2>
            <p>
              Questions about these Terms? Reach us at{' '}
              <a
                className="text-emerald-700 font-medium hover:text-emerald-800 transition-colors"
                href="mailto:support@webstructura.app"
              >
                support@webstructura.app
              </a>{' '}
              or through our{' '}
              <Link
                className="text-emerald-700 font-medium hover:text-emerald-800 transition-colors"
                to="/contact"
              >
                Contact
              </Link>{' '}
              page.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
