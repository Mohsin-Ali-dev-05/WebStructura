import SectionWrapper from './SectionWrapper.jsx';
import { WS_GRID, WS_H2, WS_SUB } from './designSystem.js';
import { listItemKey } from '../listKey.js';

/**
 * Services / Features — mobile-first 1 → 2 → 3 card grid.
 */
export default function Services({
  heading = 'Services',
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
      <header className="mb-6 md:mb-8">
        <h2 className={WS_H2}>{heading}</h2>
        {subheading ? <p className={WS_SUB}>{subheading}</p> : null}
      </header>

      {safeItems.length === 0 ? (
        <p className="text-gray-500 text-lg">No services added yet.</p>
      ) : (
        <div className={WS_GRID}>
          {safeItems.map((item, index) => (
            <article
              key={listItemKey(item, index, 'service')}
              className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 flex flex-col gap-3 text-left min-w-0 w-full"
            >
              <h3 className="text-xl md:text-2xl font-bold leading-normal tracking-tight text-gray-900">
                {item.title || 'Service'}
              </h3>
              {item.description ? (
                <p className="text-base text-gray-500 leading-normal">
                  {item.description}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </SectionWrapper>
  );
}
