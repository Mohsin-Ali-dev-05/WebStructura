import { WS_CONTAINER } from './designSystem.js';
import { listItemKey } from '../listKey.js';
import { sanitizeHref } from '../safeUrl.js';

export default function Navbar({ brand = 'My Website', links = [] }) {
  const safeLinks = Array.isArray(links) ? links : [];

  return (
    <header className="ws-navbar w-full bg-white border-b border-gray-100 sticky top-0 z-10">
      <div
        className={`${WS_CONTAINER} flex justify-between items-center w-full gap-6 py-4`}
      >
        <a
          className="text-xl font-bold tracking-tight text-gray-900"
          href="#top"
        >
          {brand}
        </a>
        <nav
          className="flex items-center gap-6 md:gap-8"
          aria-label="Primary"
        >
          {safeLinks.map((link, index) => (
            <a
              key={listItemKey(link, index, 'nav-link')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
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
