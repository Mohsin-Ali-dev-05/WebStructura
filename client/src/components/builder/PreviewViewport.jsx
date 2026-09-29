import { useMemo, useState } from 'react';
import WebsiteRenderer from '../../website/WebsiteRenderer.jsx';
import {
  getPreviewDevice,
  PREVIEW_DEVICES,
} from '../../website/previewDevices.js';
import BuilderStateMessage from './BuilderStateMessage.jsx';

/**
 * Figma-style design canvas with floating device pill + optional phone bezel.
 */
export default function PreviewViewport({
  websiteData,
  showEmptyState = true,
  className = '',
  onLoadSample = null,
  zenMode = false,
  selectedBlockId = '',
  onSelectBlock,
}) {
  const [previewMode, setPreviewMode] = useState('desktop');
  const device = useMemo(() => getPreviewDevice(previewMode), [previewMode]);

  const hasComponents =
    Array.isArray(websiteData?.components) && websiteData.components.length > 0;

  const isMobile = previewMode === 'mobile';

  const siteShellClass = [
    'preview-site-shell',
    zenMode ? 'preview-canvas-frame--zen' : 'preview-canvas-frame',
    zenMode
      ? 'w-full h-full border-none shadow-none rounded-none mx-auto my-0 overflow-y-auto overflow-x-hidden bg-white'
      : 'bg-white rounded-xl shadow-lg border border-gray-200 overflow-y-auto overflow-x-hidden mx-auto my-8 h-[calc(100vh-160px)]',
    zenMode ? 'w-full' : device.widthClass,
    isMobile && !zenMode ? 'preview-site-shell--in-bezel' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={[
        'preview-viewport preview-viewport--canvas relative flex flex-col flex-1 min-h-0',
        zenMode ? 'preview-viewport--zen bg-white' : 'bg-gray-100',
        className,
      ]
        .filter(Boolean)
        .join(' ')
        .trim()}
    >
      {!zenMode ? (
        <div
          className="preview-device-toggle preview-device-toggle--segmented absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white shadow-sm border border-gray-200 rounded-full p-1 flex items-center"
          role="group"
          aria-label="Preview device"
        >
          {PREVIEW_DEVICES.map((option) => {
            const active = previewMode === option.id;
            return (
              <button
                key={option.id}
                type="button"
                className={
                  active
                    ? 'preview-device-seg-btn bg-gray-100 text-slate-900 rounded-full'
                    : 'preview-device-seg-btn text-gray-500 rounded-full'
                }
                onClick={() => setPreviewMode(option.id)}
                aria-pressed={active}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}

      {!zenMode && onLoadSample ? (
        <button
          type="button"
          className="preview-sample-chip absolute top-4 right-4 z-10"
          onClick={onLoadSample}
          title="Load manual sample data to test the preview"
        >
          Load sample
        </button>
      ) : null}

      <div
        className={
          zenMode
            ? 'preview-viewport-stage preview-viewport-stage--zen flex-1 min-h-0 h-full overflow-hidden bg-white'
            : 'preview-viewport-stage preview-viewport-stage--canvas flex-1 min-h-0 flex items-center justify-center pt-14 px-4 pb-4 bg-gray-100'
        }
      >
        {!hasComponents && showEmptyState ? (
          <div
            className={
              zenMode
                ? 'preview-site-shell preview-site-shell--empty w-full h-full border-none shadow-none rounded-none mx-auto my-0 overflow-y-auto overflow-x-hidden bg-white'
                : 'preview-site-shell preview-site-shell--empty preview-canvas-frame bg-white rounded-xl shadow-lg border border-gray-200 overflow-y-auto overflow-x-hidden mx-auto my-8 h-[calc(100vh-160px)]'
            }
          >
            <BuilderStateMessage variant="empty" title="Nothing to preview yet">
              <p>
                Add Hero, Services, or other components in the editor. The
                preview updates as soon as the JSON changes.
              </p>
              {onLoadSample ? (
                <button
                  type="button"
                  className="primary-button"
                  onClick={onLoadSample}
                >
                  Load sample bakery site
                </button>
              ) : null}
            </BuilderStateMessage>
          </div>
        ) : isMobile && !zenMode ? (
          <div className="preview-phone-bezel mx-auto my-8" data-device="mobile">
            <div className="preview-phone-notch" aria-hidden="true" />
            <div className={siteShellClass} data-device={previewMode}>
              <div className="preview-isolation" data-preview-root="true">
                <WebsiteRenderer
                  websiteData={websiteData}
                  interactive={!zenMode}
                  selectedBlockId={selectedBlockId}
                  onSelectBlock={onSelectBlock}
                />
              </div>
            </div>
          </div>
        ) : (
          <div
            className={siteShellClass}
            data-device={zenMode ? 'desktop' : previewMode}
          >
            <div className="preview-isolation" data-preview-root="true">
              <WebsiteRenderer
                websiteData={websiteData}
                interactive={!zenMode}
                selectedBlockId={selectedBlockId}
                onSelectBlock={onSelectBlock}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
