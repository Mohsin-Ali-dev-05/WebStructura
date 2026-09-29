import { WS_CONTAINER } from './designSystem.js';
import { listItemKey } from '../listKey.js';
import { sanitizeHref } from '../safeUrl.js';

export default function Footer({ text = '', links = [] }) {
  const safeLinks = Array.isArray(links) ? links : [];

  return (
    <footer
      className="ws-footer w-full py-10 md:py-12 bg-gray-50 border-t border-gray-100"
      aria-label="Footer"
    >
      <div
        className={`${WS_CONTAINER} flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8`}
      >
        <p className="text-sm text-gray-500 m-0">{text}</p>
        {safeLinks.length > 0 ? (
          <nav
            className="flex flex-wrap items-center gap-x-6 gap-y-2"
            aria-label="Footer links"
          >
            {safeLinks.map((link, index) => (
              <a
                key={listItemKey(link, index, 'footer-link')}
                className="text-sm font-medium text-gray-500 hover:text-emerald-700 transition-all"
                href={sanitizeHref(link.href, '#')}
              >
                {link.label}
              </a>
            ))}
          </nav>
        ) : null}
      </div>
    </footer>
  );
}
