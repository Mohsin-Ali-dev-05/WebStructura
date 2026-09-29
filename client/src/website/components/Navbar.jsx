import { WS_CONTAINER } from './designSystem.js';
import { listItemKey } from '../listKey.js';
import { sanitizeHref } from '../safeUrl.js';

export default function Navbar({ brand = 'My Website', links = [] }) {
  const safeLinks = Array.isArray(links) ? links : [];

  return (
    <header className="ws-navbar w-full bg-white border-b border-gray-100 sticky top-0 z-10">
      <div
        className={`${WS_CONTAINER} flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8 py-4`}
      >
        <a
          className="font-extrabold tracking-tight text-gray-900 text-lg"
          href="#top"
        >
          {brand}
        </a>
        <nav
          className="flex flex-wrap items-center gap-x-6 gap-y-2"
          aria-label="Primary"
        >
          {safeLinks.map((link, index) => (
            <a
              key={listItemKey(link, index, 'nav-link')}
              className="text-sm font-medium text-gray-500 hover:text-emerald-700 transition-all"
              href={sanitizeHref(link.href, '#')}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
