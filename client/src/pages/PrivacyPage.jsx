import { Link } from 'react-router-dom';

export default function PrivacyPage() {
  const lastUpdated = 'October 1, 2026';

  return (
    <div className="privacy-page">
      <header className="privacy-header max-w-3xl flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200/60 mb-6 shadow-sm">
          🔒 Privacy &amp; Data
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight text-center">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 mt-4 text-center">
          Last updated: {lastUpdated}
        </p>
      </header>

      <article className="privacy-document w-full mt-12 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 p-8 md:p-12 lg:p-16">
        <div className="space-y-8 text-gray-600 leading-relaxed">
          <p>
            This Privacy Policy explains how WebStructura collects, uses, and
            protects information when you use our website builder platform and
            related services (the &quot;Service&quot;). By using the Service,
            you agree to the practices described here.
          </p>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">
              1. Information We Collect
            </h2>
            <p>
              We collect information you provide directly and data generated
              when you use the Service.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>
                Account details such as name, email address, and password
              </li>
              <li>
                Project and website content you create, upload, or generate
              </li>
              <li>
                Support messages and other communications you send us
              </li>
              <li>
                Basic technical data such as browser type, device, and IP
                address used for security and reliability
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">
              2. How We Use Your Data
            </h2>
            <p>
              We use personal and project data only as needed to operate and
              improve WebStructura.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Provide, maintain, and secure your workspace</li>
              <li>Authenticate accounts and prevent unauthorized access</li>
              <li>Respond to support requests and product feedback</li>
              <li>
                Improve features, performance, and documentation over time
              </li>
              <li>Comply with legal obligations where required</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">
              3. AI Processing
            </h2>
            <p>
              Some features may use local AI (such as Ollama) or optional
              integrations to draft content. Prompts and outputs you generate
              are processed to deliver those features. You remain responsible
              for reviewing AI-assisted content before publishing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">
              4. Sharing &amp; Disclosure
            </h2>
            <p>
              We do not sell your personal data. We may share information only
              in limited cases, such as with service providers who help us run
              the platform under confidentiality obligations, when required by
              law, or to protect the rights and safety of WebStructura and our
              users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">
              5. Data Retention
            </h2>
            <p>
              We retain account and project data for as long as your account is
              active or as needed to provide the Service. You may request
              deletion of your account and associated personal data, subject to
              legal retention requirements and backup cycles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">
              6. Security
            </h2>
            <p>
              We use reasonable administrative, technical, and organizational
              safeguards to protect information. No method of transmission or
              storage is completely secure, so we cannot guarantee absolute
              security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">
              7. Cookies &amp; Similar Technologies
            </h2>
            <p>
              We may use cookies or similar technologies for authentication,
              preferences, and understanding how the Service is used. You can
              control cookies through your browser settings, though disabling
              them may affect certain features.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">
              8. Your Rights &amp; Choices
            </h2>
            <p>
              Depending on your location, you may have rights to access,
              correct, export, or delete personal data, or to object to certain
              processing. Contact us to make a request and we will respond
              according to applicable law.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Access or update account profile information</li>
              <li>Request a copy of personal data we hold about you</li>
              <li>Request deletion of your account where available</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">
              9. Children&apos;s Privacy
            </h2>
            <p>
              The Service is not directed to children under 13 (or the minimum
              age required in your jurisdiction). We do not knowingly collect
              personal information from children. If you believe a child has
              provided us data, contact us so we can delete it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">
              10. International Transfers
            </h2>
            <p>
              If you access the Service from outside the country where our
              systems are hosted, your information may be processed in other
              regions. Where required, we use appropriate safeguards for such
              transfers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">
              11. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Material
              changes will be posted on this page with an updated &quot;Last
              updated&quot; date. Continued use of the Service after changes
              become effective constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">
              12. Contact Us
            </h2>
            <p>
              Questions about privacy or your data? Reach us at{' '}
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
