/**
 * Shared class tokens for generated website blocks.
 * Mirrored as CSS utilities in website.css (no Tailwind build step).
 *
 * Mobile: compact. Tablet/desktop: larger type + proportional media
 * that fills the column without stretch distortion.
 */

export const WS_SECTION = 'ws-section-pad py-10 md:py-16 lg:py-20 bg-white';

export const WS_CONTAINER =
  'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-w-0';

export const WS_H1 =
  'ws-h1 font-bold tracking-tight text-gray-900 text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight';

export const WS_H2 =
  'ws-h2 font-bold tracking-tight text-gray-900 text-2xl md:text-3xl lg:text-4xl leading-snug';

export const WS_SUB =
  'ws-sub max-w-2xl text-gray-500 text-base md:text-lg mt-3 mx-auto md:mx-0 leading-relaxed';

export const WS_BTN =
  'ws-btn inline-flex justify-center items-center px-5 py-2.5 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-semibold transition-colors bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm w-full sm:w-auto';

export const WS_BTN_SECONDARY =
  'ws-btn-secondary inline-flex justify-center items-center px-5 py-2.5 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-semibold transition-colors border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 w-full sm:w-auto';

export const WS_LINK =
  'text-sm md:text-base font-medium text-gray-600 hover:text-emerald-700 transition-colors';

/** Feature / card grids — 1 → 2 → 3 */
export const WS_GRID =
  'ws-responsive-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full min-w-0';

/** Media grids — 1 → 2 → 4 */
export const WS_GRID_4 =
  'ws-responsive-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 w-full min-w-0';

/** Side-by-side image/text — stack on mobile */
export const WS_FLEX_STACK =
  'ws-responsive-stack flex flex-col md:flex-row gap-6 md:gap-10 lg:gap-12 w-full min-w-0 items-center';

export const WS_IMG =
  'ws-img w-full h-full object-cover rounded-xl';

/** Hero media — column-width on desktop, capped on mobile */
export const WS_MEDIA_HERO =
  'ws-media ws-media--hero w-full overflow-hidden min-w-0 rounded-xl';

/** About media */
export const WS_MEDIA_ABOUT =
  'ws-media ws-media--about w-full overflow-hidden min-w-0 rounded-xl';

/** Card / feature thumbnails */
export const WS_MEDIA_CARD =
  'ws-media ws-media--card w-full overflow-hidden min-w-0 rounded-lg';

/** Gallery thumbs */
export const WS_MEDIA_THUMB =
  'ws-media ws-media--thumb w-full overflow-hidden min-w-0 rounded-lg';

/** @deprecated Prefer WS_MEDIA_* tokens */
export const WS_ASPECT_4_3 = WS_MEDIA_CARD;

export const WS_ASPECT_VIDEO =
  'ws-media aspect-video w-full overflow-hidden min-w-0 rounded-xl';

export const WS_SECTION_HEADER = 'mb-6 md:mb-8';
