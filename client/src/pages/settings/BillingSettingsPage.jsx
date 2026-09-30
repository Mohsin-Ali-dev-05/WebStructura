const PLAN_FEATURES = [
  'Unlimited draft projects',
  'Live preview & share URLs',
  'Export to JSON and HTML',
  'Community templates',
];

export default function BillingSettingsPage() {
  return (
    <>
      <h2 className="text-xl font-bold text-gray-900 m-0 mb-1">Billing</h2>
      <p className="text-sm text-gray-500 mt-0 mb-6 leading-relaxed">
        Review your plan and payment details. Billing is a placeholder until
        payments are connected.
      </p>

      <div className="rounded-xl border border-gray-100 bg-gray-50 p-5 mb-5 max-w-lg">
        <div className="flex items-center justify-between gap-3 mb-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 m-0">
            Current plan
          </p>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            Free
          </span>
        </div>
        <p className="text-2xl font-extrabold text-gray-900 m-0 tracking-normal">
          $0
          <span className="text-sm font-medium text-gray-500"> / month</span>
        </p>
        <p className="text-sm text-gray-500 mt-2 mb-4 leading-relaxed">
          Everything you need to design and publish starter sites.
        </p>
        <ul className="m-0 p-0 list-none space-y-2">
          {PLAN_FEATURES.map((feature) => (
            <li key={feature} className="text-sm text-gray-700 flex gap-2">
              <span className="text-emerald-600 font-bold" aria-hidden="true">
                ✓
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <dl className="settings-account-meta space-y-4 m-0 mb-5 max-w-lg">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500 m-0">
            Payment method
          </dt>
          <dd className="text-gray-900 font-medium mt-1 m-0">
            No card on file
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500 m-0">
            Next invoice
          </dt>
          <dd className="text-gray-900 font-medium mt-1 m-0">—</dd>
        </div>
      </dl>

      <div className="border-t border-gray-100 pt-6 flex flex-wrap gap-3">
        <button
          type="button"
          className="inline-flex items-center justify-center py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm transition-all"
        >
          Upgrade plan
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Manage payment method
        </button>
      </div>
    </>
  );
}
