import { Button, Card, SettingsPageShell } from '../../components/ui/index.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatDate } from '../../utils/formatDate.js';

export default function AccountSettingsPage() {
  const { user, logout } = useAuth();

  return (
    <SettingsPageShell
      title="Account"
      description="Overview of your WebStructura account."
    >
      <Card
        as="dl"
        className="settings-account-meta m-0 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12"
      >
        <div>
          <dt className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 m-0">
            Signed in as
          </dt>
          <dd className="text-lg font-semibold text-gray-900 m-0">
            {user?.email || '—'}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 m-0">
            Member since
          </dt>
          <dd className="text-lg font-semibold text-gray-900 m-0">
            {formatDate(user?.createdAt) || '—'}
          </dd>
        </div>
      </Card>

      <Card
        variant="muted"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-6"
      >
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-gray-900 m-0">Sign out</h3>
          <p className="text-sm text-gray-500 mt-1 mb-0 leading-relaxed">
            End your session on this device. You can sign back in anytime.
          </p>
        </div>
        <Button
          variant="danger"
          size="md"
          className="whitespace-nowrap"
          onClick={logout}
        >
          Log out
        </Button>
      </Card>
    </SettingsPageShell>
  );
}
