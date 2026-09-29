import PreviewViewport from './PreviewViewport.jsx';

/**
 * Center canvas column — Figma/Webflow-style design surface.
 */
export default function LivePreviewPanel({
  websiteData,
  onLoadSample,
  zenMode = false,
  selectedBlockId = '',
  onSelectBlock,
}) {
  return (
    <section
      className={
        zenMode
          ? 'live-preview-panel live-preview-panel--zen'
          : 'live-preview-panel'
      }
      aria-label="Live website preview"
    >
      <PreviewViewport
        websiteData={websiteData}
        onLoadSample={onLoadSample}
        zenMode={zenMode}
        selectedBlockId={selectedBlockId}
        onSelectBlock={onSelectBlock}
      />
    </section>
  );
}
