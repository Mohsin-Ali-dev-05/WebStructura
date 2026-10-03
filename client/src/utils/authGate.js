/**
 * Shared auth-gate copy for protected destinations.
 * Used by ProtectedRoute, AuthLink, and the Sign In banner.
 */

const FEATURE_MESSAGES = [
  {
    test: (path) => path.startsWith('/templates'),
    label: 'Templates',
    message: 'Please sign in first to browse and use templates.',
  },
  {
    test: (path) => path.startsWith('/dashboard'),
    label: 'Dashboard',
    message: 'Please sign in first to open your dashboard.',
  },
  {
    test: (path) => path === '/projects/new' || path.startsWith('/projects/new'),
    label: 'Create project',
    message: 'Please sign in first to create a project.',
  },
  {
    test: (path) => /\/projects\/[^/]+\/edit/.test(path),
    label: 'Edit project',
    message: 'Please sign in first to edit a project.',
  },
  {
    test: (path) => /\/projects\/[^/]+\/builder/.test(path),
    label: 'Builder',
    message: 'Please sign in first to open the website builder.',
  },
  {
    test: (path) => /\/projects\/[^/]+\/preview/.test(path),
    label: 'Preview',
    message: 'Please sign in first to preview this project.',
  },
  {
    test: (path) => path.startsWith('/settings'),
    label: 'Settings',
    message: 'Please sign in first to manage your account settings.',
  },
  {
    test: (path) => path.startsWith('/projects'),
    label: 'Projects',
    message: 'Please sign in first to access your projects.',
  },
];

const DEFAULT_MESSAGE = 'Please sign in first to continue.';

export function getAuthGateMessage(pathname = '') {
  const path = String(pathname || '').split('?')[0] || '';
  const match = FEATURE_MESSAGES.find((item) => item.test(path));
  return match?.message || DEFAULT_MESSAGE;
}

export function getAuthGateLabel(pathname = '') {
  const path = String(pathname || '').split('?')[0] || '';
  const match = FEATURE_MESSAGES.find((item) => item.test(path));
  return match?.label || 'this area';
}

export function buildLoginRedirectState(fromPath, options = {}) {
  const from = typeof fromPath === 'string' && fromPath ? fromPath : '/dashboard';
  const message =
    typeof options.message === 'string' && options.message.trim()
      ? options.message.trim()
      : getAuthGateMessage(from);

  return {
    from,
    authRequired: true,
    authMessage: message,
  };
}

export const PAGE_TITLES = {
  '/': 'Home',
  '/about': 'About',
  '/contact': 'Contact',
  '/privacy': 'Privacy Policy',
  '/terms': 'Terms of Service',
  '/login': 'Sign in',
  '/register': 'Create account',
  '/forgot-password': 'Forgot password',
  '/dashboard': 'Dashboard',
  '/templates': 'Templates',
  '/projects/new': 'Create project',
  '/settings': 'Settings',
  '/settings/profile': 'Profile settings',
  '/settings/account': 'Account settings',
  '/settings/security': 'Security settings',
  '/settings/appearance': 'Appearance settings',
  '/settings/notifications': 'Notification settings',
  '/settings/billing': 'Billing settings',
};

export function resolvePageTitle(pathname = '') {
  const path = String(pathname || '').split('?')[0] || '/';

  if (PAGE_TITLES[path]) {
    return PAGE_TITLES[path];
  }

  if (path.startsWith('/reset-password')) {
    return 'Reset password';
  }
  if (/\/projects\/[^/]+\/builder/.test(path)) {
    return 'Builder';
  }
  if (/\/projects\/[^/]+\/edit/.test(path)) {
    return 'Edit project';
  }
  if (/\/projects\/[^/]+\/preview/.test(path)) {
    return 'Preview';
  }
  if (path.startsWith('/settings')) {
    return 'Settings';
  }
  if (path.startsWith('/view/')) {
    return 'Shared site';
  }

  return 'WebStructura';
}

export function formatDocumentTitle(pathname = '') {
  const page = resolvePageTitle(pathname);
  if (page === 'WebStructura') {
    return 'WebStructura';
  }
  return `${page} · WebStructura`;
}
