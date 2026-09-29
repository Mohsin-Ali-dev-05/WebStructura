import SectionWrapper from './SectionWrapper.jsx';
import { WS_GRID, WS_H2, WS_SUB } from './designSystem.js';
import { listItemKey } from '../listKey.js';

export default function Testimonials({
  heading = 'Testimonials',
  subheading = '',
  items = [],
}) {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <SectionWrapper
      id="testimonials"
      className="ws-section"
      aria-label="Testimonials"
    >
      <header className="mb-10 md:mb-12">
        <h2 className={WS_H2}>{heading}</h2>
        {subheading ? <p className={WS_SUB}>{subheading}</p> : null}
      </header>

      {safeItems.length === 0 ? (
        <p className="text-gray-500 text-lg">No testimonials yet.</p>
      ) : (
        <div className={WS_GRID}>
          {safeItems.map((item, index) => (
            <blockquote
              key={listItemKey(item, index, 'testimonial')}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col gap-4 min-w-0 w-full"
            >
              <p className="text-gray-700 text-lg leading-normal italic">
                “{item.quote}”
              </p>
              <footer className="text-sm text-gray-500">
                <strong className="font-semibold text-gray-900">
                  {item.author}
                </strong>
                {item.role ? <span> — {item.role}</span> : null}
              </footer>
            </blockquote>
          ))}
        </div>
      )}
    </SectionWrapper>
  );
}
