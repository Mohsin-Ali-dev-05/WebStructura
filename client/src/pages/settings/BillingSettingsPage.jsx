import { Button, Card, SettingsPageShell } from '../../components/ui/index.js';

const PLAN_FEATURES = [
  'Unlimited draft projects',
  'Live preview & share URLs',
  'Export to JSON and HTML',
  'Community templates',
];

export default function BillingSettingsPage() {
  return (
    <SettingsPageShell
      title="Billing"
      description="WebStructura runs on the Free local plan. Paid upgrades need a payment provider and are not connected yet."
    >
      <Card as="section" className="relative">
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
          Everything you need to design and publish starter sites on this
          machine.
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
      </Card>

      <Card
        as="dl"
        className="settings-account-meta m-0 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12"
      >
        <div>
          <dt className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 m-0">
            Payment method
          </dt>
          <dd className="text-lg font-semibold text-gray-900 m-0">
            Not required
          </dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 m-0">
            Next invoice
          </dt>
          <dd className="text-lg font-semibold text-gray-900 m-0">—</dd>
        </div>
      </Card>

      <div className="pt-4 flex flex-col sm:flex-row gap-4">
        <Button type="button" disabled title="Requires a payment provider">
          Upgrade plan
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled
          title="Requires a payment provider"
        >
          Manage payment
        </Button>
      </div>
      <p className="text-sm text-gray-500 m-0 leading-relaxed">
        Upgrade and payment management stay disabled until a billing provider is
        connected. The Free plan already covers local building and export.
      </p>
    </SettingsPageShell>
  );
}
