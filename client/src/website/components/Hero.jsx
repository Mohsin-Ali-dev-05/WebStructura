import SectionWrapper from './SectionWrapper.jsx';
import {
  WS_ASPECT_4_3,
  WS_FLEX_STACK,
  WS_H1,
  WS_BTN,
  WS_IMG,
  WS_SUB,
} from './designSystem.js';
import { sanitizeHref } from '../safeUrl.js';
import { sanitizeImageSrc } from '../safeUrl.js';

/**
 * Mobile-first Hero — stacks on phones, splits on md+.
 */
export default function Hero({
  title = 'Welcome',
  subtitle = '',
  ctaLabel = '',
  ctaHref = '#',
  image = '',
  imageAlt = '',
  layout = 'split',
}) {
  const reverse = layout === 'split-reverse';
  const safeImage = sanitizeImageSrc(image);

  return (
    <SectionWrapper id="top" className="ws-hero" aria-label="Hero">
      <div
        className={[
          WS_FLEX_STACK,
          'items-center',
          reverse ? 'md:flex-row-reverse' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="flex w-full min-w-0 flex-col items-center gap-4 text-center md:w-1/2 md:items-start md:text-left">
          <h1 className={WS_H1}>{title}</h1>
          {subtitle ? <p className={WS_SUB}>{subtitle}</p> : null}
          {ctaLabel ? (
            <div className="ws-hero-actions flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:w-auto mt-4">
              <a
                className={`${WS_BTN} w-full sm:w-auto inline-flex`}
                href={sanitizeHref(ctaHref, '#')}
                onClick={(event) => event.stopPropagation()}
              >
                {ctaLabel}
              </a>
              <a
                className={`${WS_BTN} w-full sm:w-auto inline-flex`}
                href="#contact"
                onClick={(event) => event.stopPropagation()}
              >
                Learn more
              </a>
            </div>
          ) : null}
        </div>

        <div className="flex w-full min-w-0 items-center justify-center md:w-1/2">
          {safeImage ? (
            <div className={WS_ASPECT_4_3}>
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
