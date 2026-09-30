import { useAuth } from '../../context/AuthContext.jsx';
import { formatDate } from '../../utils/formatDate.js';

export default function AccountSettingsPage() {
  const { user, logout } = useAuth();

  return (
    <>
      <h2 className="text-xl font-bold text-gray-900 m-0 mb-1">Account</h2>
      <p className="text-sm text-gray-500 mt-0 mb-6 leading-relaxed">
        Overview of your WebStructura account.
      </p>

      <dl className="settings-account-meta space-y-4 m-0 mb-5">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500 m-0">
            Signed in as
          </dt>
          <dd className="text-gray-900 font-medium mt-1 m-0">
            {user?.email || '—'}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500 m-0">
            Member since
          </dt>
          <dd className="text-gray-900 font-medium mt-1 m-0">
            {formatDate(user?.createdAt) || '—'}
          </dd>
        </div>
      </dl>

      <div className="border-t border-gray-100 pt-6">
        <h3 className="text-base font-bold text-gray-900 m-0 mb-2">Sign out</h3>
        <p className="text-sm text-gray-500 mt-0 mb-4 leading-relaxed">
          End your session on this device. You can sign back in anytime.
        </p>
        <button
          type="button"
          className="inline-flex items-center justify-center py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          onClick={logout}
        >
          Log out
        </button>
      </div>
    </>
  );
}
