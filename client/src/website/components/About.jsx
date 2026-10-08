import SectionWrapper from './SectionWrapper.jsx';
import {
  WS_FLEX_STACK,
  WS_H2,
  WS_IMG,
  WS_MEDIA_ABOUT,
  WS_SUB,
} from './designSystem.js';
import { resolveMediaSrc } from '../imageFromKeyword.js';
import { sanitizeImageSrc } from '../safeUrl.js';

export default function About({
  heading = 'About',
  body = '',
  image = '',
  imageKeyword = '',
  imageAlt = '',
  layout = 'split',
}) {
  const safeImage = sanitizeImageSrc(
    resolveMediaSrc({ image, imageKeyword, salt: 2 }),
  );
  const split =
    layout === 'split' || layout === 'split-reverse' || Boolean(safeImage);
  const reverse = layout === 'split-reverse';

  return (
    <SectionWrapper id="about" className="ws-section ws-about" aria-label="About">
      <div
        className={
          split
            ? [WS_FLEX_STACK, reverse ? 'md:flex-row-reverse' : '']
                .filter(Boolean)
                .join(' ')
            : 'flex flex-col gap-4 w-full min-w-0'
        }
      >
        <div className={split ? 'w-full min-w-0 md:w-[55%]' : 'w-full min-w-0'}>
          <h2 className={WS_H2}>{heading}</h2>
          {body ? <p className={`${WS_SUB} mt-3`}>{body}</p> : null}
        </div>

        {safeImage ? (
          <div
            className={
              split
                ? `w-full min-w-0 md:w-[45%] flex md:justify-end`
                : 'w-full min-w-0'
            }
          >
            <div className={WS_MEDIA_ABOUT}>
              <img
                src={safeImage}
                alt={imageAlt || heading}
                className={WS_IMG}
                loading="lazy"
                decoding="async"
                onError={(event) => {
                  const fallback = resolveMediaSrc({
                    imageKeyword: imageKeyword || 'business',
                    salt: 98,
                  });
                  if (fallback && event.currentTarget.src !== fallback) {
                    event.currentTarget.src = fallback;
                    return;
                  }
                  event.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </SectionWrapper>
  );
}
