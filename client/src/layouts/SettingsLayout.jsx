import { NavLink, Outlet } from 'react-router-dom';

const SETTINGS_NAV = [
  { to: 'profile', label: 'Profile' },
  { to: 'account', label: 'Account' },
  { to: 'security', label: 'Security' },
  { to: 'appearance', label: 'Appearance' },
  { to: 'notifications', label: 'Notifications' },
  { to: 'billing', label: 'Billing' },
];

export default function SettingsLayout() {
  return (
    <div className="settings-page">
      <header className="settings-header mb-8">
        <p className="settings-kicker">Account</p>
        <h1 className="text-3xl font-extrabold text-gray-900 m-0 tracking-normal">
          Settings
        </h1>
        <p className="text-gray-600 mt-2 m-0 leading-relaxed">
          Manage your profile, security, and workspace preferences.
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        <nav
          className="settings-nav flex md:flex-col gap-2 md:w-52 shrink-0 overflow-x-auto"
          aria-label="Settings sections"
        >
          {SETTINGS_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'settings-tab text-sm font-medium px-4 py-2.5 rounded-xl text-left transition-colors border whitespace-nowrap',
                  isActive
                    ? 'settings-tab--active bg-emerald-600 text-white border-transparent shadow-sm'
                    : 'settings-tab--inactive text-gray-600 border-transparent hover:bg-gray-50',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <section className="settings-panel flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
