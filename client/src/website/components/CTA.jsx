import SectionWrapper from './SectionWrapper.jsx';
import { WS_BTN } from './designSystem.js';
import { sanitizeHref } from '../safeUrl.js';

/**
 * High-contrast CTA Banner — stacks on mobile.
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
      <div className="rounded-2xl bg-gray-900 px-6 py-12 md:px-12 md:py-16 text-center md:text-left flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-12 lg:gap-16">
        <div className="max-w-2xl min-w-0 w-full">
          <h2 className="font-extrabold tracking-tight text-white text-3xl md:text-4xl">
            {heading}
          </h2>
          {body ? (
            <p className="max-w-3xl text-gray-300 text-lg md:text-xl mt-4 mx-auto md:mx-0">
              {body}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0 justify-center items-stretch sm:items-center w-full sm:w-auto">
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
              className={WS_BTN}
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
