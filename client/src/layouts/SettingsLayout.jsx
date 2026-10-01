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
    <div className="settings-page max-w-4xl mx-auto px-1 sm:px-0">
      <header className="settings-header mb-4 md:mb-5">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 m-0 tracking-normal">
          Settings
        </h1>
        <p className="text-gray-600 mt-1.5 m-0 leading-relaxed text-sm md:text-base max-w-2xl">
          Manage your profile, security, and workspace preferences.
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-3 md:gap-4 min-w-0 items-start">
        <nav
          className="settings-nav flex flex-row md:flex-col gap-1 w-full md:w-40 shrink-0 overflow-x-auto pb-1 md:pb-0 -mx-1 px-1 md:mx-0 md:px-0"
          aria-label="Settings sections"
        >
          {SETTINGS_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'settings-tab text-sm font-medium px-3 py-2 rounded-xl text-left transition-colors border whitespace-nowrap shrink-0',
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

        <section className="settings-panel flex-1 max-w-2xl w-full min-w-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
