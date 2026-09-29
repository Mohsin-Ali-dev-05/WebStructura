import { useEffect, useId, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/logo.jpg";

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

function ChevronIcon() {
  return (
    <svg
      className="w-4 h-4 opacity-80"
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
    "text-sm font-medium text-emerald-100 hover:text-emerald-300 transition-colors";

  const publicLinks = (
    <>
      <Link to="/" className={navLinkClass}>
        Home
      </Link>
      <Link to="/about" className={navLinkClass}>
        About
      </Link>
      <Link to="/contact" className={navLinkClass}>
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

  const guestLinks = (
    <>
      <Link to="/login" className={navLinkClass}>
        Log in
      </Link>
      <Link to="/register" className="nav-cta">
        Get started
      </Link>
    </>
  );

  const accountDropdown = (
    <div className="account-menu relative" ref={accountMenuRef}>
      <button
        type="button"
        className="account-menu-trigger flex items-center gap-3 rounded-lg px-1.5 py-1 transition-colors hover:bg-emerald-800/40"
        aria-expanded={accountMenuOpen}
        aria-haspopup="menu"
        aria-controls={accountMenuId}
        aria-label={`Account menu for ${displayName}`}
        onClick={() => setAccountMenuOpen((open) => !open)}
      >
        <AccountAvatar avatarUrl={avatarUrl} initials={initials} />
        <span className="text-sm font-medium text-white hidden sm:inline">
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
      className="text-sm font-medium text-emerald-200 hover:text-white hover:bg-emerald-800/50 px-3 py-1.5 rounded-lg transition-all"
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
            isHome ? "site-header site-header--transparent" : "site-header",
            isProjectForm ? "shrink-0" : "",
            menuOpen ? "site-header--menu-open" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="site-header-bar flex items-center justify-between w-full gap-4">
            <Link to="/" className="brand">
              <img
                src={logo}
                alt="WebStructura"
                className="brand-logo h-8 w-auto object-contain"
              />
            </Link>

            <button
              type="button"
              className="site-nav-toggle md:hidden"
              aria-expanded={menuOpen}
              aria-controls="primary-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <MenuIcon open={menuOpen} />
            </button>

            <nav
              className="site-nav hidden md:flex items-center gap-8"
              aria-label="Primary"
            >
              <div className="flex items-center gap-8">{publicLinks}</div>

              {!loading && isAuthenticated ? (
                <>
                  <div className="flex items-center gap-8">{authLinks}</div>
                  <div className="flex items-center border-l border-emerald-700/50 pl-6 ml-2">
                    {accountDropdown}
                  </div>
                </>
              ) : null}

              {!loading && !isAuthenticated ? (
                <div className="flex items-center gap-8">{guestLinks}</div>
              ) : null}
            </nav>
          </div>

          <nav
            id="primary-menu"
            className={[
              "site-nav site-nav--mobile md:hidden flex-col gap-3 w-full",
              menuOpen ? "flex" : "hidden",
            ].join(" ")}
            aria-label="Primary"
            hidden={!menuOpen}
          >
            {publicLinks}

            {!loading && isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 py-1 text-sm font-medium text-white">
                  <AccountAvatar avatarUrl={avatarUrl} initials={initials} />
                  <span>{displayName}</span>
                </div>
                {authLinks}
                {logoutButton}
              </>
            ) : null}

            {!loading && !isAuthenticated ? guestLinks : null}
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
                : "site-main pt-24"
          }
        >
          <Outlet />
        </main>
      )}

      {!isBuilder && !isAuth && !isProjectForm && (
        <footer className="site-footer py-8 border-t border-gray-200 bg-gray-50">
          <div className="site-footer-inner flex flex-col items-center gap-3">
            <p className="text-sm text-gray-500 text-center m-0">
              &copy; {new Date().getFullYear()} WebStructura. All rights
              reserved.
            </p>
            <nav
              className="footer-legal flex items-center justify-center gap-5"
              aria-label="Legal"
            >
              <Link
                to="/privacy"
                className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
              >
                Terms of Service
              </Link>
            </nav>
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
