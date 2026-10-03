import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import ExportModal from './ExportModal.jsx';
import { exportProjectZip } from '../../services/projectService.js';

function slugify(value) {
  return (
    String(value || 'website')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'website'
  );
}

function downloadBlob(filename, content, mimeType) {
  const blob =
    content instanceof Blob
      ? content
      : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function buildStaticHtml(projectName, websiteData) {
  const title = projectName || websiteData?.title || 'WebStructura Site';
  const payload = JSON.stringify(websiteData ?? {}, null, 2);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title.replace(/</g, '')}</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; padding: 2rem; background: #f8fafc; color: #0f172a; }
    h1 { margin: 0 0 0.5rem; }
    p { color: #64748b; }
    pre { background: #0f172a; color: #e2e8f0; padding: 1.25rem; border-radius: 0.75rem; overflow: auto; font-size: 0.8rem; }
  </style>
</head>
<body>
  <h1>${title.replace(/</g, '')}</h1>
  <p>Exported from WebStructura as static HTML. websiteData payload:</p>
  <pre>${payload.replace(/</g, '\\u003c')}</pre>
</body>
</html>
`;
}

export default function BuilderToolbar({
  projectId,
  projectName,
  onProjectNameChange,
  onSave,
  saving,
  saveMessage,
  saveError,
  isDirty = false,
  websiteData = null,
  isPreviewMode = false,
  onTogglePreview,
}) {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const canSave = isDirty && Boolean(projectName.trim()) && !saving;

  const closeExportModal = useCallback(() => {
    if (exporting) {
      return;
    }
    setIsExportModalOpen(false);
  }, [exporting]);

  async function handleExportOption(optionId) {
    const base = slugify(projectName || websiteData?.title || 'website');

    if (optionId === 'raw-json') {
      downloadBlob(
        `${base}-websiteData.json`,
        JSON.stringify(websiteData ?? {}, null, 2),
        'application/json',
      );
      toast.success('JSON exported.');
      closeExportModal();
      return;
    }

    if (optionId === 'static-html') {
      downloadBlob(
        `${base}.html`,
        buildStaticHtml(projectName, websiteData),
        'text/html',
      );
      toast.success('Static HTML downloaded.');
      closeExportModal();
      return;
    }

    if (optionId === 'react-zip') {
      if (!projectId) {
        toast.error('Save the project before exporting a React ZIP.');
        return;
      }

      setExporting(true);
      const exportToast = toast.loading('Exporting React project…');

      try {
        if (isDirty && typeof onSave === 'function') {
          await onSave();
        }

        const { blob, filename } = await exportProjectZip(projectId);
        downloadBlob(filename || `${base}-export.zip`, blob, 'application/zip');
        toast.success('React ZIP downloaded.', {
          id: exportToast,
          duration: 3000,
        });
        setIsExportModalOpen(false);
      } catch (error) {
        toast.error(error?.message || 'Export failed. Please try again.', {
          id: exportToast,
          duration: 4000,
        });
      } finally {
        setExporting(false);
      }
    }
  }

  return (
    <>
      <header
        className={
          isPreviewMode
            ? 'builder-toolbar builder-toolbar--zen bg-gradient-to-r from-emerald-950 to-emerald-900 border-b border-emerald-800/50 shadow-sm'
            : 'builder-toolbar bg-gradient-to-r from-emerald-950 to-emerald-900 border-b border-emerald-800/50 shadow-sm'
        }
      >
        <div className="builder-toolbar-left">
          <Link to="/" className="builder-brand" aria-label="WebStructura home">
            <span className="brand-mark">W</span>
            <span className="brand-text">WebStructura</span>
          </Link>
          <span className="builder-toolbar-divider" aria-hidden="true" />
          <Link to="/dashboard" className="builder-back-link">
            ← Dashboard
          </Link>
          <label className="builder-name-field">
            <span className="visually-hidden">Project name</span>
            <input
              type="text"
              className="bg-transparent border-0 outline-none shadow-none rounded-md px-2 py-1.5 text-white font-semibold hover:bg-white/10 focus:bg-white/20 focus:outline-none transition-colors duration-200"
              value={projectName}
              onChange={(event) => onProjectNameChange(event.target.value)}
              placeholder="Untitled project"
              maxLength={100}
              aria-label="Project name"
            />
          </label>
        </div>

        <div className="builder-toolbar-right">
          {saveError ? (
            <span className="builder-toast error">{saveError}</span>
          ) : null}
          {saveMessage ? (
            <span className="builder-toast success">{saveMessage}</span>
          ) : null}

          {!isPreviewMode ? (
            <>
              <Link
                className="builder-toolbar-link text-white/75 hover:text-white transition-colors duration-200"
                to={`/view/${projectId}`}
                target="_blank"
                rel="noreferrer"
              >
                Share URL
              </Link>
              <button
                type="button"
                className="builder-toolbar-link builder-toolbar-link--button text-white/75 hover:text-white transition-colors duration-200"
                onClick={() => {
                  if (typeof onTogglePreview === 'function') {
                    onTogglePreview();
                  }
                }}
              >
                Full preview
              </button>
              <Link
                className="builder-toolbar-link text-white/75 hover:text-white transition-colors duration-200"
                to={`/projects/${projectId}/edit`}
              >
                Settings
              </Link>
              <button
                type="button"
                className="bg-white text-emerald-900 hover:bg-slate-50 px-4 py-1.5 rounded-md font-medium text-sm shadow-sm transition-all active:scale-95 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={() => setIsExportModalOpen(true)}
                disabled={exporting}
                aria-busy={exporting}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
                  <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
                </svg>
                {exporting ? 'Exporting…' : 'Export'}
              </button>
            </>
          ) : null}

          {isDirty ? (
            <button
              type="button"
              className="builder-save-btn builder-save-btn--dirty"
              onClick={onSave}
              disabled={!canSave}
              aria-busy={saving}
            >
              {saving ? 'Saving…' : 'Save project'}
            </button>
          ) : (
            <span
              className="builder-save-status bg-emerald-900/50 text-emerald-400 border border-emerald-700/50 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2"
              aria-live="polite"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-3.5 h-3.5 shrink-0"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clipRule="evenodd"
                />
              </svg>
              {saving ? 'Saving…' : 'Saved'}
            </span>
          )}
        </div>
      </header>

      <ExportModal
        open={isExportModalOpen}
        onClose={closeExportModal}
        onSelectOption={handleExportOption}
        exporting={exporting}
      />
    </>
  );
}
