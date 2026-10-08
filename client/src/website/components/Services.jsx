import SectionWrapper from './SectionWrapper.jsx';
import {
  WS_GRID,
  WS_H2,
  WS_IMG,
  WS_MEDIA_CARD,
  WS_SUB,
} from './designSystem.js';
import { resolveMediaSrc } from '../imageFromKeyword.js';
import { listItemKey } from '../listKey.js';
import { sanitizeImageSrc } from '../safeUrl.js';

/**
 * Services / Features — compact cards with small thumbs.
 */
export default function Services({
  heading = 'Features',
  subheading = '',
  items = [],
}) {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <SectionWrapper
      id="services"
      className="ws-section ws-services"
      aria-label="Services"
    >
      <header className="mb-5 md:mb-7">
        <h2 className={WS_H2}>{heading}</h2>
        {subheading ? <p className={WS_SUB}>{subheading}</p> : null}
      </header>

      {safeItems.length === 0 ? (
        <p className="text-gray-500 text-sm">No features added yet.</p>
      ) : (
        <div className={WS_GRID}>
          {safeItems.map((item, index) => {
            const photo = sanitizeImageSrc(
              resolveMediaSrc({
                image: item.image,
                imageKeyword: item.imageKeyword,
                salt: index + 3,
              }),
            );

            return (
              <article
                key={listItemKey(item, index, 'service')}
                className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100 flex flex-col gap-2.5 text-left min-w-0 w-full"
              >
                {photo ? (
                  <div className={WS_MEDIA_CARD}>
                    <img
                      src={photo}
                      alt={item.imageAlt || item.title || 'Feature'}
                      className={WS_IMG}
                      loading="lazy"
                      decoding="async"
                      onError={(event) => {
                        const fallback = resolveMediaSrc({
                          imageKeyword: item.imageKeyword || 'business',
                          salt: index + 50,
                        });
                        if (fallback && event.currentTarget.src !== fallback) {
                          event.currentTarget.src = fallback;
                          return;
                        }
                        event.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                ) : null}
                <h3 className="text-lg md:text-xl font-semibold leading-snug tracking-tight text-gray-900">
                  {item.title || 'Feature'}
                </h3>
                {item.description ? (
                  <p className="text-sm md:text-base text-gray-500 leading-relaxed">
                    {item.description}
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </SectionWrapper>
  );
}
