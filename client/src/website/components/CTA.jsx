import SectionWrapper from './SectionWrapper.jsx';
import { WS_BTN, WS_BTN_SECONDARY } from './designSystem.js';
import { sanitizeHref } from '../safeUrl.js';

/**
 * Compact CTA banner — real-site proportions.
 */
export default function CTA({
  heading = 'Ready to get started?',
  body = 'Launch your next site in minutes with a clean, structured builder.',
  ctaLabel = 'Start building',
  ctaHref = '#contact',
  secondaryLabel = '',
  secondaryHref = '#',
}) {
  return (
    <SectionWrapper id="cta" className="ws-cta" aria-label="Call to action">
      <div className="rounded-xl bg-gray-900 px-5 py-6 md:px-7 md:py-7 text-center md:text-left flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
        <div className="max-w-xl min-w-0 w-full mx-auto md:mx-0">
          <h2 className="ws-h2 font-bold tracking-tight text-white leading-snug">
            {heading}
          </h2>
          {body ? (
            <p className="ws-sub max-w-xl text-gray-300 mt-3 mx-auto md:mx-0 leading-relaxed">
              {body}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0 justify-center w-full sm:w-auto">
          {ctaLabel ? (
            <a
              className={WS_BTN}
              href={sanitizeHref(ctaHref, '#contact')}
            >
              {ctaLabel}
            </a>
          ) : null}
          {secondaryLabel ? (
            <a
              className={`${WS_BTN_SECONDARY} border-white/25 text-white bg-transparent hover:bg-white/10`}
              href={sanitizeHref(secondaryHref, '#')}
            >
              {secondaryLabel}
            </a>
          ) : null}
        </div>
      </div>
    </SectionWrapper>
  );
}
