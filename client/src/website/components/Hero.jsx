import SectionWrapper from './SectionWrapper.jsx';
import {
  WS_ASPECT_4_3,
  WS_FLEX_STACK,
  WS_H1,
  WS_BTN,
  WS_IMG,
} from './designSystem.js';
import { resolveMediaSrc } from '../imageFromKeyword.js';
import { sanitizeHref, sanitizeImageSrc } from '../safeUrl.js';

/**
 * Mobile-first Hero — stacks on phones, splits on md+.
 * Prefers AI imageKeyword → loremflickr when no direct image URL is set.
 */
export default function Hero({
  title = 'Welcome',
  subtitle = '',
  ctaLabel = '',
  ctaHref = '#',
  secondaryLabel = 'Learn more',
  secondaryHref = '#contact',
  image = '',
  imageKeyword = '',
  imageAlt = '',
  layout = 'split',
}) {
  const reverse = layout === 'split-reverse';
  const safeImage = sanitizeImageSrc(
    resolveMediaSrc({ image, imageKeyword }),
  );

  return (
    <SectionWrapper
      id="top"
      className="ws-hero py-12 md:py-16"
      aria-label="Hero"
    >
      <div
        className={[
          WS_FLEX_STACK,
          'items-center',
          reverse ? 'md:flex-row-reverse' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="flex w-full min-w-0 flex-col items-center gap-3 text-center md:w-1/2 md:items-start md:text-left px-1 md:px-0">
          <h1 className={WS_H1}>{title}</h1>
          {subtitle ? (
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto md:mx-0 mt-4">
              {subtitle}
            </p>
          ) : null}
          {ctaLabel ? (
            <div className="ws-hero-actions flex flex-col sm:flex-row items-center gap-4 mt-6 w-full sm:w-auto">
              <a
                className={`${WS_BTN} w-full sm:w-auto inline-flex`}
                href={sanitizeHref(ctaHref, '#')}
                onClick={(event) => event.stopPropagation()}
              >
                {ctaLabel}
              </a>
              {secondaryLabel ? (
                <a
                  className="inline-flex justify-center items-center px-8 py-3.5 rounded-full font-medium transition-colors border border-gray-300 text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
                  href={sanitizeHref(secondaryHref, '#contact')}
                  onClick={(event) => event.stopPropagation()}
                >
                  {secondaryLabel}
                </a>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex w-full min-w-0 items-center justify-center md:w-1/2 px-1 md:px-0">
          {safeImage ? (
            <div className={`${WS_ASPECT_4_3} rounded-2xl`}>
              <img
                src={safeImage}
                alt={imageAlt || title}
                className={WS_IMG}
                loading="lazy"
              />
            </div>
          ) : (
            <div className="ws-hero-graphic" aria-hidden="true">
              <div className="ws-hero-graphic-frame">
                <span className="ws-hero-graphic-bar" />
                <span className="ws-hero-graphic-block ws-hero-graphic-block--lg" />
                <span className="ws-hero-graphic-block" />
                <span className="ws-hero-graphic-block ws-hero-graphic-block--sm" />
              </div>
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
