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
      <header className="mb-5 md:mb-7 max-w-2xl">
        <h2 className={WS_H2}>{heading}</h2>
        {subheading ? <p className={WS_SUB}>{subheading}</p> : null}
      </header>

      {safeItems.length === 0 ? (
        <p className="text-gray-500 text-sm">No questions yet.</p>
      ) : (
        <div className="flex flex-col gap-2.5 max-w-2xl">
          {safeItems.map((item, index) => (
            <details
              key={listItemKey(item, index, 'faq')}
              className="group rounded-xl border border-gray-100 bg-white p-4 md:p-5 shadow-sm open:shadow-md transition-all"
            >
              <summary className="cursor-pointer list-none font-semibold text-gray-900 text-sm md:text-base tracking-tight flex justify-between items-center gap-3">
                <span>{item.question || `Question ${index + 1}`}</span>
                <span
                  className="text-emerald-600 text-lg leading-none shrink-0"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <div className="mt-3 text-gray-500 text-sm leading-relaxed">
                <p className="m-0">{item.answer || ''}</p>
              </div>
            </details>
          ))}
        </div>
      )}
    </SectionWrapper>
  );
}
