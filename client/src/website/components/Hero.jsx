import SectionWrapper from './SectionWrapper.jsx';
import {
  WS_BTN,
  WS_BTN_SECONDARY,
  WS_FLEX_STACK,
  WS_H1,
  WS_IMG,
  WS_MEDIA_HERO,
} from './designSystem.js';
import { resolveMediaSrc } from '../imageFromKeyword.js';
import { sanitizeHref, sanitizeImageSrc } from '../safeUrl.js';

/**
 * Mobile-first Hero — stacks on phones, splits on md+.
 * Media is intentionally modest (not full-viewport photos).
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
    resolveMediaSrc({ image, imageKeyword, salt: 1 }),
  );

  return (
    <SectionWrapper
      id="top"
      className="ws-hero py-10 md:py-16"
      aria-label="Hero"
    >
      <div
        className={[
          WS_FLEX_STACK,
          reverse ? 'md:flex-row-reverse' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="flex w-full min-w-0 flex-col items-center gap-3 text-center md:w-[52%] md:items-start md:text-left px-0">
          <h1 className={WS_H1}>{title}</h1>
          {subtitle ? (
            <p className="ws-sub text-base md:text-lg text-gray-600 max-w-xl mx-auto md:mx-0 mt-3 leading-relaxed">
              {subtitle}
            </p>
          ) : null}
          {ctaLabel ? (
            <div className="ws-hero-actions flex flex-col sm:flex-row items-center gap-3 mt-6 w-full sm:w-auto">
              <a
                className={WS_BTN}
                href={sanitizeHref(ctaHref, '#')}
                onClick={(event) => event.stopPropagation()}
              >
                {ctaLabel}
              </a>
              {secondaryLabel ? (
                <a
                  className={WS_BTN_SECONDARY}
                  href={sanitizeHref(secondaryHref, '#contact')}
                  onClick={(event) => event.stopPropagation()}
                >
                  {secondaryLabel}
                </a>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex w-full min-w-0 items-center justify-center md:w-[48%] md:justify-end px-0">
          {safeImage ? (
            <div className={WS_MEDIA_HERO}>
              <img
                src={safeImage}
                alt={imageAlt || title}
                className={WS_IMG}
                loading="eager"
                decoding="async"
                onError={(event) => {
                  const fallback = resolveMediaSrc({
                    imageKeyword: imageKeyword || 'business',
                    salt: 99,
                  });
                  if (fallback && event.currentTarget.src !== fallback) {
                    event.currentTarget.src = fallback;
                    return;
                  }
                  event.currentTarget.style.display = 'none';
                }}
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
