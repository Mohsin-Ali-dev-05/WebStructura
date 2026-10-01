import { useEffect, useId, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function getUserInitials(name) {
  if (typeof name !== "string" || !name.trim()) {
    return "?";
  }

  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] || ""}${parts[parts.length - 1][0] || ""}`.toUpperCase();
}

function AccountAvatar({ avatarUrl, initials, sizeClass = "h-8 w-8" }) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt=""
        className={`${sizeClass} rounded-full object-cover shadow-sm ring-2 ring-emerald-800/50`}
        aria-hidden="true"
      />
    );
  }

  return (
    <span
      className={`${sizeClass} rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold text-white shadow-sm ring-2 ring-emerald-800/50`}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

function MenuIcon({ open }) {
  return open ? (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ) : (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function ChevronIcon({ className = "w-4 h-4 opacity-80" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

const FEATURES_LINKS = [
  { label: "How it works", to: "/#how-it-works" },
  { label: "Templates", to: "/templates" },
  { label: "Live preview", to: "/about" },
];

const RESOURCES_LINKS = [
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
];

function NavDropdown({ label, items, mobile = false, onNavigate }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  if (mobile) {
    return (
      <div className="nav-dropdown nav-dropdown--mobile w-full">
        <button
          type="button"
          className="nav-dropdown-trigger flex w-full items-center justify-between gap-2 text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors py-2"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((value) => !value)}
        >
          <span>{label}</span>
          <ChevronIcon
            className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
        <div
          id={menuId}
          className={`nav-dropdown-panel-mobile overflow-hidden transition-all duration-200 ${
            open ? "max-h-64 opacity-100 mt-1" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-1 pl-3 border-l border-gray-200">
            {items.map((item) => (
              <Link
                key={item.to + item.label}
                to={item.to}
                className="block py-2 text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
                onClick={() => {
                  setOpen(false);
                  if (typeof onNavigate === "function") {
                    onNavigate();
                  }
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="nav-dropdown group relative">
      <button
        type="button"
        className="nav-dropdown-trigger inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onFocus={() => setOpen(true)}
        onBlur={(event) => {
          if (!event.currentTarget.parentElement?.contains(event.relatedTarget)) {
            setOpen(false);
          }
        }}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{label}</span>
        <ChevronIcon className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
      </button>
      <div
        id={menuId}
        role="menu"
        className={`nav-dropdown-panel absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-50 transition-all duration-200 origin-top ${
          open
            ? "opacity-100 visible translate-y-0 pointer-events-auto"
            : "opacity-0 invisible -translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto"
        }`}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {items.map((item) => (
          <Link
            key={item.to + item.label}
            to={item.to}
            role="menuitem"
            className="nav-dropdown-item block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function MainLayout() {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);
  const accountMenuId = useId();

  const isBuilder = /\/projects\/[^/]+\/builder\/?$/.test(location.pathname);
  const isHome = location.pathname === "/";
  const isAuth =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password" ||
    location.pathname.startsWith("/reset-password/");
  const isProjectForm =
    location.pathname === "/projects/new" ||
    /\/projects\/[^/]+\/edit\/?$/.test(location.pathname);

  const shellClass = isProjectForm
    ? "min-h-screen flex flex-col bg-gray-50"
    : [
        "app-shell",
        isBuilder ? "app-shell--builder" : "",
        isHome ? "app-shell--home" : "",
        isAuth ? "app-shell--auth app-shell--register" : "",
      ]
        .filter(Boolean)
        .join(" ");

  const displayName = user?.name?.trim() || "Account";
  const initials = getUserInitials(displayName);
  const avatarUrl = user?.avatarUrl || "";

  useEffect(() => {
    setMenuOpen(false);
    setAccountMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!accountMenuOpen) {
      return undefined;
    }

    function handlePointerDown(event) {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setAccountMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setAccountMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [accountMenuOpen]);

  async function confirmLogout() {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 350));
      logout();
      setLogoutOpen(false);
      navigate("/login", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  }

  const navLinkClass =
    "text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors";

  const publicLinksDesktop = (
    <>
      <Link to="/" className={navLinkClass}>
        Home
      </Link>
      <NavDropdown label="Features" items={FEATURES_LINKS} />
      <NavDropdown label="Resources" items={RESOURCES_LINKS} />
      <Link to="/about" className={navLinkClass}>
        About
      </Link>
      <Link to="/contact" className={navLinkClass}>
        Contact
      </Link>
    </>
  );

  const publicLinksMobile = (
    <>
      <Link
        to="/"
        className={navLinkClass}
        onClick={() => setMenuOpen(false)}
      >
        Home
      </Link>
      <NavDropdown
        label="Features"
        items={FEATURES_LINKS}
        mobile
        onNavigate={() => setMenuOpen(false)}
      />
      <NavDropdown
        label="Resources"
        items={RESOURCES_LINKS}
        mobile
        onNavigate={() => setMenuOpen(false)}
      />
      <Link
        to="/about"
        className={navLinkClass}
        onClick={() => setMenuOpen(false)}
      >
        About
      </Link>
      <Link
        to="/contact"
        className={navLinkClass}
        onClick={() => setMenuOpen(false)}
      >
        Contact
      </Link>
    </>
  );

  const authLinks = (
    <>
      <Link to="/dashboard" className={navLinkClass}>
        Dashboard
      </Link>
      <Link to="/templates" className={navLinkClass}>
        Templates
      </Link>
      <Link to="/settings" className={`${navLinkClass} md:hidden`}>
        Settings
      </Link>
    </>
  );

  const guestLinksDesktop = (
    <>
      <Link to="/login" className={navLinkClass}>
        Log in
      </Link>
      <Link to="/register" className="nav-cta">
        Get started
      </Link>
    </>
  );

  const guestLinksMobile = (
    <>
      <Link
        to="/login"
        className={navLinkClass}
        onClick={() => setMenuOpen(false)}
      >
        Log in
      </Link>
      <Link
        to="/register"
        className="nav-cta"
        onClick={() => setMenuOpen(false)}
      >
        Get started
      </Link>
    </>
  );

  const accountDropdown = (
    <div className="account-menu relative" ref={accountMenuRef}>
      <button
        type="button"
        className="account-menu-trigger flex items-center gap-3 rounded-lg px-1.5 py-1 transition-colors hover:bg-gray-100"
        aria-expanded={accountMenuOpen}
        aria-haspopup="menu"
        aria-controls={accountMenuId}
        aria-label={`Account menu for ${displayName}`}
        onClick={() => setAccountMenuOpen((open) => !open)}
      >
        <AccountAvatar avatarUrl={avatarUrl} initials={initials} />
        <span className="text-sm font-medium text-gray-900 hidden sm:inline">
          {displayName}
        </span>
        <ChevronIcon />
      </button>

      {accountMenuOpen ? (
        <div
          id={accountMenuId}
          className="account-menu-panel absolute right-0 mt-2 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl"
          role="menu"
          aria-label="Account"
        >
          <Link
            to="/settings"
            role="menuitem"
            className="account-menu-item block px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
            onClick={() => setAccountMenuOpen(false)}
          >
            Settings
          </Link>
          <button
            type="button"
            role="menuitem"
            className="account-menu-item account-menu-item--button block w-full px-4 py-3 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
            onClick={() => {
              setAccountMenuOpen(false);
              setLogoutOpen(true);
            }}
          >
            Log out
          </button>
        </div>
      ) : null}
    </div>
  );

  const logoutButton = (
    <button
      type="button"
      className="text-sm font-medium text-gray-600 hover:text-emerald-600 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-all"
      onClick={() => {
        setMenuOpen(false);
        setLogoutOpen(true);
      }}
    >
      Log out
    </button>
  );

  return (
    <div className={shellClass}>
      {!isBuilder && !isAuth && (
        <header
          className={[
            "site-header sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md",
            isProjectForm ? "shrink-0" : "",
            menuOpen ? "site-header--menu-open" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="site-header-bar max-w-7xl mx-auto px-6 h-20 flex items-center justify-between w-full gap-3 md:gap-4 min-w-0">
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <img
                src="/images/logo.png"
                alt="WebStructura"
                className="h-8 w-auto object-contain"
              />
              <span className="brand-wordmark text-gray-900 group-hover:text-emerald-700 transition-colors">
                WebStructura
              </span>
            </Link>

            <button
              type="button"
              className="site-nav-toggle md:hidden ml-auto shrink-0"
              aria-expanded={menuOpen}
              aria-controls="primary-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <MenuIcon open={menuOpen} />
            </button>

            <nav
              className="site-nav site-nav--desktop hidden md:flex items-center gap-6 lg:gap-8 flex-1 min-w-0 justify-end"
              aria-label="Primary"
            >
              <div className="flex items-center gap-4 lg:gap-8 min-w-0">
                {publicLinksDesktop}
              </div>

              {!loading && isAuthenticated ? (
                <>
                  <div className="flex items-center gap-4 lg:gap-8">
                    {authLinks}
                  </div>
                  <div className="flex items-center border-l border-gray-200 pl-4 lg:pl-6 ml-1 lg:ml-2 shrink-0">
                    {accountDropdown}
                  </div>
                </>
              ) : null}

              {!loading && !isAuthenticated ? (
                <div className="flex items-center gap-3 lg:gap-4 shrink-0">
                  {guestLinksDesktop}
                </div>
              ) : null}
            </nav>
          </div>

          <nav
            id="primary-menu"
            className={[
              "site-nav site-nav--mobile md:hidden flex-col gap-1 w-full max-w-7xl mx-auto px-6 pb-4",
              menuOpen ? "flex" : "hidden",
            ].join(" ")}
            aria-label="Primary"
            hidden={!menuOpen}
          >
            {publicLinksMobile}

            {!loading && isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 py-1 text-sm font-medium text-gray-900">
                  <AccountAvatar avatarUrl={avatarUrl} initials={initials} />
                  <span>{displayName}</span>
                </div>
                {authLinks}
                {logoutButton}
              </>
            ) : null}

            {!loading && !isAuthenticated ? guestLinksMobile : null}
          </nav>
        </header>
      )}

      {isProjectForm ? (
        <Outlet />
      ) : (
        <main
          className={
            isBuilder
              ? "site-main site-main--builder"
              : isAuth
                ? "site-main site-main--register"
                : "site-main pt-12 md:pt-16 pb-24 md:pb-0"
          }
        >
          <Outlet />
        </main>
      )}

      {!isBuilder && !isAuth && !isProjectForm && (
        <footer
          className="site-footer site-footer--fat py-10 md:py-12 pb-32 md:pb-10 border-t border-gray-200 bg-gray-50"
          aria-label="Site footer"
        >
          <div className="site-footer-inner site-footer-inner--fat w-full max-w-6xl mx-auto px-4 md:px-6">
            <div className="site-footer-grid grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 tracking-wide mb-3">
                  Product
                </h3>
                <ul className="flex flex-col gap-2 list-none m-0 p-0">
                  <li>
                    <Link
                      to="/"
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/templates"
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      Templates
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard"
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      Dashboard
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 tracking-wide mb-3">
                  Resources
                </h3>
                <ul className="flex flex-col gap-2 list-none m-0 p-0">
                  <li>
                    <Link
                      to="/about"
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/projects/new"
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      Create project
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 tracking-wide mb-3">
                  Company
                </h3>
                <ul className="flex flex-col gap-2 list-none m-0 p-0">
                  <li>
                    <Link
                      to="/about"
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      About us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      Support
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/settings"
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      Settings
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 tracking-wide mb-3">
                  Legal
                </h3>
                <ul className="flex flex-col gap-2 list-none m-0 p-0">
                  <li>
                    <Link
                      to="/privacy"
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/terms"
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="site-footer-bottom border-t border-gray-200 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm text-gray-500 m-0">
                &copy; {new Date().getFullYear()} WebStructura. All rights
                reserved.
              </p>
              <nav
                className="flex items-center gap-4"
                aria-label="Social media"
              >
                <a
                  href="#"
                  className="text-gray-400 hover:text-gray-700 transition-colors"
                  aria-label="X (Twitter)"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    className="w-5 h-5"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-gray-700 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    className="w-5 h-5"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-gray-700 transition-colors"
                  aria-label="GitHub"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                </a>
              </nav>
            </div>
          </div>
        </footer>
      )}


      <ConfirmDialog
        open={logoutOpen}
        onOpenChange={(open) => {
          if (!open && !loggingOut) {
            setLogoutOpen(false);
          }
        }}
        title="Log out"
        description="Are you sure you want to log out of WebStructura?"
        confirmText="Log out"
        cancelText="Stay signed in"
        loading={loggingOut}
        onConfirm={confirmLogout}
      />
    </div>
  );
}
