import SectionWrapper from './SectionWrapper.jsx';
import {
  WS_GRID,
  WS_H2,
  WS_IMG,
  WS_MEDIA_CARD,
  WS_SUB,
  WS_BTN,
} from './designSystem.js';
import { resolveMediaSrc } from '../imageFromKeyword.js';
import { listItemKey } from '../listKey.js';
import { sanitizeHref, sanitizeImageSrc } from '../safeUrl.js';

export default function Projects({
  heading = 'Projects',
  subheading = '',
  items = [],
}) {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <SectionWrapper
      id="projects"
      className="ws-section"
      aria-label="Projects"
    >
      <header className="mb-5 md:mb-7">
        <h2 className={WS_H2}>{heading}</h2>
        {subheading ? <p className={WS_SUB}>{subheading}</p> : null}
      </header>

      {safeItems.length === 0 ? (
        <p className="text-gray-500 text-sm">No projects yet.</p>
      ) : (
        <div className={WS_GRID}>
          {safeItems.map((item, index) => {
            const href = sanitizeHref(item.link, '');
            const image = sanitizeImageSrc(
              resolveMediaSrc({
                image: item.image,
                imageKeyword: item.imageKeyword,
                salt: index + 10,
              }),
            );

            return (
              <article
                key={listItemKey(item, index, 'project')}
                className="flex flex-col h-full min-w-0 w-full bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {image ? (
                  <div className={WS_MEDIA_CARD}>
                    <img
                      src={image}
                      alt={item.title || 'Product'}
                      className={WS_IMG}
                      loading="lazy"
                      decoding="async"
                      onError={(event) => {
                        const fallback = resolveMediaSrc({
                          imageKeyword: item.imageKeyword || 'business',
                          salt: index + 60,
                        });
                        if (fallback && event.currentTarget.src !== fallback) {
                          event.currentTarget.src = fallback;
                          return;
                        }
                        event.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div
                    className={`${WS_MEDIA_CARD} bg-gray-50`}
                    aria-hidden="true"
                  />
                )}

                <div className="p-4 md:p-5 flex flex-col flex-grow min-w-0 gap-2">
                  <h3 className="text-base font-semibold tracking-tight text-gray-900">
                    {item.title}
                  </h3>
                  {item.description ? (
                    <p className="line-clamp-2 text-gray-500 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  ) : null}
                  {href ? (
                    <a
                      className={`${WS_BTN} mt-auto self-start`}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View project
                    </a>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </SectionWrapper>
  );
}
