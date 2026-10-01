import SectionWrapper from './SectionWrapper.jsx';
import { WS_H2, WS_SUB } from './designSystem.js';
import { listItemKey } from '../listKey.js';

/**
 * FAQ Accordion — native details/summary.
 */
export default function FAQ({
  heading = 'Frequently asked questions',
  subheading = '',
  items = [],
}) {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <SectionWrapper id="faq" className="ws-section ws-faq" aria-label="FAQ">
      <header className="mb-4 md:mb-6 max-w-2xl">
        <h2 className={WS_H2}>{heading}</h2>
        {subheading ? <p className={WS_SUB}>{subheading}</p> : null}
      </header>

      {safeItems.length === 0 ? (
        <p className="text-gray-500 text-lg">No questions yet.</p>
      ) : (
        <div className="flex flex-col gap-3 max-w-2xl">
          {safeItems.map((item, index) => (
            <details
              key={listItemKey(item, index, 'faq')}
              className="group rounded-2xl border border-gray-100 bg-white p-5 md:p-6 shadow-sm open:shadow-md transition-all"
            >
              <summary className="cursor-pointer list-none font-semibold text-gray-900 text-base md:text-lg tracking-tight flex justify-between items-center gap-4">
                <span>{item.question || `Question ${index + 1}`}</span>
                <span
                  className="text-emerald-600 text-xl leading-none shrink-0"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <div className="mt-4 text-gray-500 text-base leading-normal">
                <p>{item.answer || ''}</p>
              </div>
            </details>
          ))}
        </div>
      )}
    </SectionWrapper>
  );
}
