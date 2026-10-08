import { WS_CONTAINER, WS_LINK } from './designSystem.js';
import { listItemKey } from '../listKey.js';
import { sanitizeHref } from '../safeUrl.js';

export default function Navbar({ brand = 'My Website', links = [] }) {
  const safeLinks = Array.isArray(links) ? links : [];

  return (
    <header className="ws-navbar w-full bg-white/95 border-b border-gray-100 sticky top-0 z-10 backdrop-blur-sm">
      <div
        className={`${WS_CONTAINER} flex justify-between items-center w-full gap-4 py-3`}
      >
        <a
          className="text-base md:text-lg font-bold tracking-tight text-gray-900 shrink-0"
          href="#top"
        >
          {brand}
        </a>
        <nav
          className="flex items-center gap-4 md:gap-5 flex-wrap justify-end"
          aria-label="Primary"
        >
          {safeLinks.map((link, index) => (
            <a
              key={listItemKey(link, index, 'nav-link')}
              className={WS_LINK}
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
