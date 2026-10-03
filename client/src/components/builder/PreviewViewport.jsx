import { useMemo, useState } from "react";
import WebsiteRenderer from "../../website/WebsiteRenderer.jsx";
import {
  getPreviewDevice,
  PREVIEW_DEVICES,
} from "../../website/previewDevices.js";
import BuilderStateMessage from "./BuilderStateMessage.jsx";

/**
 * Figma-style design canvas with device controls above the preview frame.
 */
export default function PreviewViewport({
  websiteData,
  showEmptyState = true,
  className = "",
  onLoadSample = null,
  zenMode = false,
  selectedBlockId = "",
  onSelectBlock,
}) {
  const [previewMode, setPreviewMode] = useState("desktop");
  const device = useMemo(() => getPreviewDevice(previewMode), [previewMode]);

  const hasComponents =
    Array.isArray(websiteData?.components) && websiteData.components.length > 0;

  const isMobile = previewMode === "mobile";

  const desktopShellClass = [
    "preview-site-shell",
    "preview-canvas-frame",
    "w-full max-w-6xl h-full min-w-0 bg-white rounded-xl shadow-xl shadow-slate-900/5 border border-slate-200 overflow-hidden ring-1 ring-black/[0.02] transition-all",
    previewMode === "tablet" ? "w-[768px] max-w-full" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const zenShellClass =
    "preview-site-shell preview-canvas-frame--zen w-full h-full border-none shadow-none rounded-none mx-auto my-0 overflow-y-auto overflow-x-hidden bg-white";

  const emptyShellClass = zenMode
    ? "preview-site-shell preview-site-shell--empty w-full h-full border-none shadow-none rounded-none mx-auto my-0 overflow-y-auto overflow-x-hidden bg-white"
    : "preview-site-shell preview-site-shell--empty preview-canvas-frame w-full max-w-6xl h-full bg-white rounded-xl shadow-xl shadow-slate-900/5 border border-slate-200 overflow-hidden ring-1 ring-black/[0.02] transition-all";

  return (
    <div
      className={[
        "preview-viewport preview-viewport--canvas flex flex-col w-full h-full flex-1 min-h-0 gap-6",
        zenMode ? "preview-viewport--zen bg-white" : "bg-slate-100",
        className,
      ]
        .filter(Boolean)
        .join(" ")
        .trim()}
    >
      {!zenMode ? (
        <div className="preview-controls relative w-full max-w-6xl flex items-center justify-between px-2 shrink-0">
          <div
            className="preview-device-toggle preview-device-toggle--segmented flex items-center bg-white border border-slate-200/80 rounded-full p-1 shadow-sm"
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
                      ? "preview-device-seg-btn bg-slate-800 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-sm"
                      : "preview-device-seg-btn text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
                  }
                  onClick={() => setPreviewMode(option.id)}
                  aria-pressed={active}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          {onLoadSample ? (
            <button
              type="button"
              className="preview-sample-chip bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50 hover:text-slate-900 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm transition-all active:scale-95"
              onClick={onLoadSample}
              title="Load manual sample data to test the preview"
            >
              Load sample
            </button>
          ) : (
            <div aria-hidden="true" />
          )}
        </div>
      ) : null}

      <div
        className={
          zenMode
            ? "preview-viewport-stage preview-viewport-stage--zen flex-1 min-h-0 h-full w-full overflow-hidden bg-white"
            : "preview-viewport-stage preview-viewport-stage--canvas flex-1 min-h-0 w-full flex items-start justify-center px-4 pb-4 overflow-auto bg-slate-100"
        }
      >
        {!hasComponents && showEmptyState ? (
          <div className={emptyShellClass}>
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
          <div
            className="preview-phone-bezel mx-auto w-[375px] max-w-full h-[812px] max-h-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-900/10 border-[8px] border-slate-900 overflow-hidden relative ring-1 ring-slate-900/5 box-border"
            data-device="mobile"
          >
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-50 pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="preview-site-shell preview-site-shell--in-bezel w-full h-full min-w-0 overflow-y-auto overflow-x-hidden bg-white"
              data-device="mobile"
            >
              <div
                className="preview-isolation w-full min-w-0 overflow-y-auto overflow-x-hidden"
                data-preview-root="true"
              >
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
            className={zenMode ? zenShellClass : desktopShellClass}
            data-device={zenMode ? "desktop" : previewMode}
          >
            <div
              className="preview-isolation w-full h-full min-w-0 overflow-y-auto overflow-x-hidden"
              data-preview-root="true"
            >
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
