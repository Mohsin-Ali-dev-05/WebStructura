/**
 * Device simulation for the builder live preview.
 * Widths match common viewport targets (Tailwind w-[375px] / w-[768px] / w-full).
 */
export const PREVIEW_DEVICES = [
  {
    id: 'desktop',
    label: 'Desktop',
    widthClass: 'w-full',
  },
  {
    id: 'tablet',
    label: 'Tablet',
    widthClass: 'w-[768px]',
  },
  {
    id: 'mobile',
    label: 'Mobile',
    widthClass: 'w-[375px]',
  },
];

export function getPreviewDevice(previewMode) {
  return (
    PREVIEW_DEVICES.find((device) => device.id === previewMode) ||
    PREVIEW_DEVICES[0]
  );
}
