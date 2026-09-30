import SectionWrapper from './SectionWrapper.jsx';
import { WS_GRID, WS_H2, WS_SUB } from './designSystem.js';
import { listItemKey } from '../listKey.js';

export default function Skills({
  heading = 'Skills',
  subheading = '',
  items = [],
}) {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <SectionWrapper id="skills" className="ws-section" aria-label="Skills">
      <header className="mb-6 md:mb-8">
        <h2 className={WS_H2}>{heading}</h2>
        {subheading ? <p className={WS_SUB}>{subheading}</p> : null}
      </header>

      {safeItems.length === 0 ? (
        <p className="text-gray-500 text-lg">No skills yet.</p>
      ) : (
        <div className={WS_GRID}>
          {safeItems.map((item, index) => (
            <div
              key={listItemKey(item, index, 'skill')}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col gap-2 min-w-0 w-full"
            >
              <strong className="font-semibold text-gray-900 text-lg tracking-tight">
                {item.name}
              </strong>
              {item.level ? (
                <span className="text-sm text-emerald-700 font-medium">
                  {item.level}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </SectionWrapper>
  );
}
