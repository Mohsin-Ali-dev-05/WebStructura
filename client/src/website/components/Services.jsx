import SectionWrapper from './SectionWrapper.jsx';
import { WS_ASPECT_4_3, WS_GRID, WS_H2, WS_IMG, WS_SUB } from './designSystem.js';
import { resolveMediaSrc } from '../imageFromKeyword.js';
import { listItemKey } from '../listKey.js';
import { sanitizeImageSrc } from '../safeUrl.js';

/**
 * Services / Features — mobile-first 1 → 2 → 3 card grid with optional photos.
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
      <header className="mb-4 md:mb-6 px-1 md:px-0">
        <h2 className={WS_H2}>{heading}</h2>
        {subheading ? <p className={WS_SUB}>{subheading}</p> : null}
      </header>

      {safeItems.length === 0 ? (
        <p className="text-gray-500 text-lg">No features added yet.</p>
      ) : (
        <div className={`${WS_GRID} grid-cols-1 md:grid-cols-2 lg:grid-cols-3`}>
          {safeItems.map((item, index) => {
            const photo = sanitizeImageSrc(
              resolveMediaSrc({
                image: item.image,
                imageKeyword: item.imageKeyword,
              }),
            );

            return (
              <article
                key={listItemKey(item, index, 'service')}
                className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col gap-3 text-left min-w-0 w-full"
              >
                {photo ? (
                  <div className={`${WS_ASPECT_4_3} rounded-xl`}>
                    <img
                      src={photo}
                      alt={item.imageAlt || item.title || 'Feature'}
                      className={WS_IMG}
                      loading="lazy"
                    />
                  </div>
                ) : null}
                <h3 className="text-xl md:text-2xl font-bold leading-normal tracking-tight text-gray-900">
                  {item.title || 'Feature'}
                </h3>
                {item.description ? (
                  <p className="text-base text-gray-500 leading-normal">
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
