import SectionWrapper from './SectionWrapper.jsx';
import {
  WS_ASPECT_4_3,
  WS_FLEX_STACK,
  WS_H2,
  WS_IMG,
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
    resolveMediaSrc({ image, imageKeyword }),
  );
  const split = layout === 'split' || layout === 'split-reverse' || Boolean(safeImage);
  const reverse = layout === 'split-reverse';

  return (
    <SectionWrapper id="about" className="ws-section ws-about" aria-label="About">
      <div
        className={
          split
            ? [
                WS_FLEX_STACK,
                'items-center',
                reverse ? 'md:flex-row-reverse' : '',
              ]
                .filter(Boolean)
                .join(' ')
            : 'flex flex-col gap-4 md:gap-6 w-full min-w-0'
        }
      >
        <div className={split ? 'w-full min-w-0 md:w-1/2 px-1 md:px-0' : 'w-full min-w-0'}>
          <h2 className={WS_H2}>{heading}</h2>
          {body ? <p className={WS_SUB}>{body}</p> : null}
        </div>

        {safeImage ? (
          <div
            className={
              split
                ? `w-full min-w-0 md:w-1/2 ${WS_ASPECT_4_3} rounded-2xl px-1 md:px-0`
                : `${WS_ASPECT_4_3} min-w-0 rounded-2xl`
            }
          >
            <img
              src={safeImage}
              alt={imageAlt || heading}
              className={WS_IMG}
              loading="lazy"
            />
          </div>
        ) : null}
      </div>
    </SectionWrapper>
  );
}
