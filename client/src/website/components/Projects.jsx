import SectionWrapper from './SectionWrapper.jsx';
import { WS_ASPECT_4_3, WS_GRID, WS_H2, WS_IMG, WS_SUB } from './designSystem.js';
import { listItemKey } from '../listKey.js';
import { sanitizeHref } from '../safeUrl.js';
import { sanitizeImageSrc } from '../safeUrl.js';

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
      <header className="mb-6 md:mb-8">
        <h2 className={WS_H2}>{heading}</h2>
        {subheading ? <p className={WS_SUB}>{subheading}</p> : null}
      </header>

      {safeItems.length === 0 ? (
        <p className="text-gray-500 text-lg">No projects yet.</p>
      ) : (
        <div className={WS_GRID}>
          {safeItems.map((item, index) => {
            const href = sanitizeHref(item.link, '');
            const image = sanitizeImageSrc(item.image || '');

            return (
              <article
                key={listItemKey(item, index, 'project')}
                className="flex flex-col h-full min-w-0 w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {image ? (
                  <div className={`${WS_ASPECT_4_3} overflow-hidden`}>
                    <img
                      src={image}
                      alt={item.title || 'Product'}
                      className={WS_IMG}
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div
                    className={`${WS_ASPECT_4_3} bg-gray-50 rounded-2xl`}
                    aria-hidden="true"
                  />
                )}

                <div className="p-5 md:p-6 flex flex-col flex-grow min-w-0">
                  <h3 className="text-lg font-bold tracking-tight text-gray-900">
                    {item.title}
                  </h3>
                  {item.description ? (
                    <p className="line-clamp-2 text-gray-500 text-sm mt-2 mb-6">
                      {item.description}
                    </p>
                  ) : (
                    <div className="mb-6" />
                  )}
                  {href ? (
                    <a
                      className="inline-flex justify-center items-center px-6 py-3 rounded-xl font-medium transition-colors bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm w-full sm:w-auto mt-auto"
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
