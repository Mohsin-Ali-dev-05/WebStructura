import SectionWrapper from './SectionWrapper.jsx';
import {
  WS_ASPECT_4_3,
  WS_GRID_4,
  WS_H2,
  WS_IMG,
  WS_SUB,
} from './designSystem.js';
import { listItemKey } from '../listKey.js';
import { sanitizeImageSrc } from '../safeUrl.js';

/**
 * Gallery — mobile-first image grid (1 → 2 → 4).
 */
export default function Gallery({
  heading = 'Gallery',
  subheading = '',
  images = [],
}) {
  const safeImages = (Array.isArray(images) ? images : [])
    .map((item, index) => {
      if (typeof item === 'string') {
        const url = sanitizeImageSrc(item);
        if (!url) {
          return null;
        }
        return {
          url,
          alt: `Gallery image ${index + 1}`,
          _editorId: undefined,
        };
      }
      if (item && typeof item === 'object' && item.url) {
        const url = sanitizeImageSrc(item.url);
        if (!url) {
          return null;
        }
        return {
          url,
          alt: item.alt || `Gallery image ${index + 1}`,
          _editorId: item._editorId,
        };
      }
      return null;
    })
    .filter(Boolean);

  return (
    <SectionWrapper
      id="gallery"
      className="ws-section ws-gallery"
      aria-label="Gallery"
    >
      <header className="mb-10 md:mb-12">
        <h2 className={WS_H2}>{heading}</h2>
        {subheading ? <p className={WS_SUB}>{subheading}</p> : null}
      </header>

      {safeImages.length === 0 ? (
        <p className="text-gray-500 text-lg">No images yet.</p>
      ) : (
        <div className={WS_GRID_4}>
          {safeImages.map((image, index) => (
            <figure
              key={listItemKey(image, index, 'gallery')}
              className={`${WS_ASPECT_4_3} min-w-0 w-full`}
            >
              <img
                src={image.url}
                alt={image.alt}
                className={WS_IMG}
                loading="lazy"
              />
            </figure>
          ))}
        </div>
      )}
    </SectionWrapper>
  );
}
