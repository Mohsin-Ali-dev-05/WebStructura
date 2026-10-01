import { useAuth } from '../../context/AuthContext.jsx';
import { formatDate } from '../../utils/formatDate.js';

export default function AccountSettingsPage() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-8 max-w-3xl">
      <header>
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight m-0">
          Account
        </h2>
        <p className="text-base text-gray-500 mt-2 mb-0 leading-relaxed">
          Overview of your WebStructura account.
        </p>
      </header>

      <dl className="settings-account-meta m-0 bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12">
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
      </dl>

      <div className="bg-gray-50/50 border border-gray-200 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-gray-900 m-0">Sign out</h3>
          <p className="text-sm text-gray-500 mt-1 mb-0 leading-relaxed">
            End your session on this device. You can sign back in anytime.
          </p>
        </div>
        <button
          type="button"
          className="whitespace-nowrap inline-flex items-center justify-center py-2.5 px-6 rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold shadow-sm hover:bg-gray-50 hover:text-red-600 hover:border-red-200 transition-all duration-200"
          onClick={logout}
        >
          Log out
        </button>
      </div>
    </div>
  );
}
