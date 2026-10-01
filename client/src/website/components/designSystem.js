/**
 * Shared Tailwind class tokens for generated website blocks.
 * Mirrored as CSS utilities in website.css (no Tailwind build step).
 *
 * Grids/flex MUST be mobile-first: 1 column / stacked by default,
 * then expand at md/lg. Spacing stays dense for a premium SaaS feel.
 */

export const WS_SECTION =
  'py-8 md:py-12 bg-white';

export const WS_CONTAINER =
  'max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 w-full min-w-0';

export const WS_H1 =
  'font-extrabold tracking-tighter text-gray-900 text-5xl md:text-6xl';

export const WS_H2 =
  'font-extrabold tracking-tight text-gray-900 text-3xl md:text-4xl';

export const WS_SUB =
  'max-w-2xl text-gray-500 text-base md:text-lg mt-2 mx-auto md:mx-0';

export const WS_BTN =
  'inline-flex justify-center items-center px-8 py-3.5 rounded-full font-medium transition-colors bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm w-full sm:w-auto';

/** Standard feature / card grids — 1 → 2 → 3 columns */
export const WS_GRID =
  'ws-responsive-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full min-w-0';

/** Denser media grids — 1 → 2 → 4 columns */
export const WS_GRID_4 =
  'ws-responsive-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full min-w-0';

/** Side-by-side image/text — stack on mobile */
export const WS_FLEX_STACK =
  'ws-responsive-stack flex flex-col md:flex-row gap-6 md:gap-8 w-full min-w-0';

export const WS_IMG =
  'w-full h-full object-cover rounded-2xl';

export const WS_ASPECT_4_3 = 'aspect-[4/3] w-full overflow-hidden min-w-0';

export const WS_ASPECT_VIDEO = 'aspect-video w-full overflow-hidden min-w-0';

/** Shared section header spacing */
export const WS_SECTION_HEADER = 'mb-4 md:mb-6';
