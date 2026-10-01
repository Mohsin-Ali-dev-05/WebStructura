const PLAN_FEATURES = [
  'Unlimited draft projects',
  'Live preview & share URLs',
  'Export to JSON and HTML',
  'Community templates',
];

export default function BillingSettingsPage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <header>
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight m-0">
          Billing
        </h2>
        <p className="text-base text-gray-500 mt-2 mb-0 leading-relaxed">
          Review your plan and payment details. Billing is a placeholder until
          payments are connected.
        </p>
      </header>

      <section className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm relative">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 m-0">
            Current plan
          </p>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/60 shadow-sm">
            Free
          </span>
        </div>

        <p className="text-4xl font-extrabold text-gray-900 tracking-tight mt-4 mb-0">
          $0
          <span className="text-lg font-medium text-gray-400"> / month</span>
        </p>
        <p className="text-base text-gray-500 mt-2 mb-0 leading-relaxed">
          Everything you need to design and publish starter sites.
        </p>

        <ul className="m-0 p-0 list-none space-y-3 mt-6 pt-6 border-t border-gray-100">
          {PLAN_FEATURES.map((feature) => (
            <li key={feature} className="flex items-center text-gray-700 font-medium">
              <span
                className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-black mr-3 shrink-0"
                aria-hidden="true"
              >
                ✓
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </section>

      <dl className="settings-account-meta m-0 bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12">
        <div>
          <dt className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 m-0">
            Payment method
          </dt>
          <dd className="text-lg font-semibold text-gray-900 m-0">
            No card on file
          </dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 m-0">
            Next invoice
          </dt>
          <dd className="text-lg font-semibold text-gray-900 m-0">—</dd>
        </div>
      </dl>

      <div className="pt-4 flex flex-col sm:flex-row gap-4">
        <button
          type="button"
          className="inline-flex items-center justify-center py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-600/20 transition-all duration-200 hover:-translate-y-0.5"
        >
          Upgrade plan
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center py-3 px-6 rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold shadow-sm hover:bg-gray-50 transition-all duration-200"
        >
          Manage payment
        </button>
      </div>
    </div>
  );
}
