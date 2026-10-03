import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import AiAssistantPanel, {
  applyCopyToComponentProps,
} from '../components/builder/AiAssistantPanel.jsx';
import BuilderStateMessage from '../components/builder/BuilderStateMessage.jsx';
import BuilderToolbar from '../components/builder/BuilderToolbar.jsx';
import LivePreviewPanel from '../components/builder/LivePreviewPanel.jsx';
import WebsiteEditorPanel from '../components/builder/WebsiteEditorPanel.jsx';
import {
  createSavedSnapshot,
  UnsavedChangesGuard,
  useDirtyProjectState,
} from '../hooks/useUnsavedChangesGuard.jsx';
import { streamWebsiteGeneration } from '../services/aiService.js';
import { getProject, updateProject } from '../services/projectService.js';
import {
  createComponent,
  createDefaultWebsiteData,
  normalizeWebsiteData,
} from '../website/schema.js';
import { MANUAL_SAMPLE_WEBSITE_DATA } from '../website/sampleWebsiteData.js';

/** Preview + Editor only — AI sidebar is hidden below 1024px */
const COMPACT_TABS = [
  { id: 'preview', label: 'Preview' },
  { id: 'editor', label: 'Editor' },
];

function coerceComponentsFromStream(rawText) {
  let text = String(rawText || '').trim();
  text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const parsed = JSON.parse(text);

  if (Array.isArray(parsed)) {
    return parsed;
  }
  if (parsed && typeof parsed === 'object') {
    if (Array.isArray(parsed.components)) {
      return parsed.components;
    }
    if (Array.isArray(parsed.data)) {
      return parsed.data;
    }
    if (Array.isArray(parsed.sections)) {
      return parsed.sections;
    }
  }
  throw new Error('AI stream did not return a components array.');
}

export default function BuilderPage() {
  const { id } = useParams();
  const [projectName, setProjectName] = useState('');
  const [websiteData, setWebsiteData] = useState(null);
  const [savedSnapshot, setSavedSnapshot] = useState('');
  const [selectedBlockId, setSelectedBlockId] = useState('');
  const [addType, setAddType] = useState('Hero');
  const [compactTab, setCompactTab] = useState('preview');
  const [isLeftOpen, setIsLeftOpen] = useState(true);
  const [isRightOpen, setIsRightOpen] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const terminalRef = useRef(null);
  const streamAbortRef = useRef(null);

  const isDirty = useDirtyProjectState(projectName, websiteData, savedSnapshot);
  const showLeft = isLeftOpen && !isPreviewMode;
  const showRight = isRightOpen && !isPreviewMode;

  useEffect(() => {
    if (!isStreaming || !terminalRef.current) {
      return;
    }
    terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [streamingText, isStreaming]);

  useEffect(() => {
    return () => {
      streamAbortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError('');

      try {
        const response = await getProject(id);
        if (cancelled) {
          return;
        }

        const project = response.data.project;
        const savedFromDb = normalizeWebsiteData(project.websiteData);
        const hasComponents =
          Array.isArray(savedFromDb.components) &&
          savedFromDb.components.length > 0;

        const editorData = hasComponents
          ? savedFromDb
          : normalizeWebsiteData(createDefaultWebsiteData(project.name));

        setProjectName(project.name);
        setWebsiteData(editorData);
        setSavedSnapshot(createSavedSnapshot(project.name, savedFromDb));
        setSelectedBlockId(editorData.components[0]?.id || '');
      } catch (err) {
        if (!cancelled) {
          setLoadError(err.message || 'Could not load project.');
          setWebsiteData(null);
          setSavedSnapshot('');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  function updateComponents(updater) {
    setWebsiteData((current) => {
      if (!current) {
        return current;
      }
      const nextComponents =
        typeof updater === 'function'
          ? updater(current.components || [])
          : updater;
      return {
        ...current,
        components: nextComponents,
      };
    });
    setSaveMessage('');
  }

  function handleThemeChange(field, value) {
    setWebsiteData((current) => {
      if (!current) {
        return current;
      }
      return {
        ...current,
        theme: {
          ...current.theme,
          [field]: value,
        },
      };
    });
    setSaveMessage('');
  }

  function handleAddComponent() {
    const next = createComponent(addType);
    updateComponents((components) => [...components, next]);
    setSelectedBlockId(next.id);
    setCompactTab('editor');
  }

  /**
   * Apply Copilot draft to the selected section, or the first matching type.
   * Returns false when nothing could be updated (caller shows toast).
   */
  function handleApplyAiCopy(text, preferredType) {
    const copy = typeof text === 'string' ? text.trim() : '';
    if (!copy) {
      toast.error('Nothing to apply — generate a draft first.');
      return false;
    }

    const components = websiteData?.components || [];
    if (components.length === 0) {
      toast.error('Add a section in the editor before applying copy.');
      return false;
    }

    let target = components.find((item) => item.id === selectedBlockId) || null;

    if (target && preferredType && target.type !== preferredType) {
      const matching = components.find((item) => item.type === preferredType);
      if (matching) {
        target = matching;
      }
    }

    if (!target && preferredType) {
      target = components.find((item) => item.type === preferredType) || null;
    }

    if (!target) {
      toast.error('Select a section in the editor, then apply.');
      return false;
    }

    updateComponents((list) =>
      list.map((item) =>
        item.id === target.id
          ? {
              ...item,
              props: applyCopyToComponentProps(item.type, item.props, copy),
            }
          : item,
      ),
    );
    setSelectedBlockId(target.id);
    setCompactTab('preview');
    toast.success(`Applied to ${target.type}.`, { duration: 3000 });
    return true;
  }

  function handleRemoveComponent(componentId) {
    const remaining = (websiteData?.components || []).filter(
      (item) => item.id !== componentId,
    );
    updateComponents(() => remaining);
    if (selectedBlockId === componentId) {
      setSelectedBlockId(remaining[0]?.id || '');
    }
  }

  function moveComponent(componentId, direction) {
    updateComponents((components) => {
      const index = components.findIndex((item) => item.id === componentId);
      if (index < 0) {
        return components;
      }

      const target = index + direction;
      if (target < 0 || target >= components.length) {
        return components;
      }

      const next = [...components];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return next;
    });
  }

  function handlePropsChange(nextPropsOrUpdater) {
    updateComponents((components) =>
      components.map((item) => {
        if (item.id !== selectedBlockId) {
          return item;
        }
        const prevProps = item.props || {};
        const nextProps =
          typeof nextPropsOrUpdater === 'function'
            ? nextPropsOrUpdater(prevProps)
            : nextPropsOrUpdater;
        return { ...item, props: { ...nextProps } };
      }),
    );
  }

  function handleLoadSample() {
    const sample = normalizeWebsiteData(MANUAL_SAMPLE_WEBSITE_DATA);
    setWebsiteData(sample);
    setSelectedBlockId(sample.components[0]?.id || '');
    setSaveMessage('');
    setCompactTab('preview');
  }

  async function handleStreamWebsiteGenerate(brief) {
    const prompt = String(brief || '').trim();
    if (!prompt || isStreaming) {
      return;
    }

    streamAbortRef.current?.abort();
    const controller = new AbortController();
    streamAbortRef.current = controller;

    setIsStreaming(true);
    setStreamingText('');
    setIsLeftOpen(true);
    setCompactTab('preview');

    try {
      const finalText = await streamWebsiteGeneration({
        name: projectName || websiteData?.title || 'My Website',
        description: prompt,
        prompt,
        signal: controller.signal,
        onChunk(chunk) {
          setStreamingText((current) => current + chunk);
        },
      });

      const components = coerceComponentsFromStream(finalText);
      const next = normalizeWebsiteData({
        ...(websiteData || createDefaultWebsiteData()),
        title: projectName || websiteData?.title || 'My Website',
        components,
      });

      setWebsiteData(next);
      setSelectedBlockId(next.components[0]?.id || '');
      setIsStreaming(false);
      toast.success('Website generated — preview updated.', { duration: 3000 });
    } catch (error) {
      if (error?.name === 'AbortError') {
        setIsStreaming(false);
        return;
      }
      setIsStreaming(false);
      toast.error(
        error?.message ||
          'AI stream failed. Check that the API and Ollama are running.',
        { duration: 4500 },
      );
    } finally {
      if (streamAbortRef.current === controller) {
        streamAbortRef.current = null;
      }
    }
  }

  async function handleSaveProject() {
    const trimmedName = projectName.trim();
    if (!trimmedName) {
      setSaveError('Project name is required.');
      setSaveMessage('');
      toast.error('Project name is required.');
      throw new Error('Project name is required.');
    }

    setSaving(true);
    setSaveError('');
    setSaveMessage('');

    // Persist full websiteData (includes AI-generated components)
    const payloadWebsiteData = {
      ...websiteData,
      title: websiteData.title || trimmedName,
    };

    const saveToast = toast.loading('Saving project...');

    try {
      await updateProject(id, {
        name: trimmedName,
        websiteData: payloadWebsiteData,
      });
      setProjectName(trimmedName);
      setWebsiteData(payloadWebsiteData);
      // Clears isDirty — snapshot matches MongoDB again
      setSavedSnapshot(createSavedSnapshot(trimmedName, payloadWebsiteData));
      setSaveMessage('Project saved successfully!');
      toast.success('Project saved successfully!', {
        id: saveToast,
        duration: 3000,
      });
    } catch (error) {
      const message =
        error?.message ||
        'Unable to save. Check that the API and database are online.';
      setSaveError(message);
      toast.error(message, {
        id: saveToast,
        duration: 4000,
      });
      throw error;
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="builder-workspace builder-workspace--state">
        <BuilderStateMessage variant="loading" title="Loading builder">
          <p>Fetching your project and website data…</p>
        </BuilderStateMessage>
      </div>
    );
  }

  if (loadError || !websiteData) {
    return (
      <div className="builder-workspace builder-workspace--state">
        <BuilderStateMessage
          variant="error"
          title="Could not open builder"
          action={
            <Link className="primary-button" to="/dashboard">
              Back to dashboard
            </Link>
          }
        >
          <p>{loadError || 'This project could not be found.'}</p>
        </BuilderStateMessage>
      </div>
    );
  }

  return (
    <div
      className={
        isPreviewMode
          ? 'builder-workspace builder-workspace--zen h-screen w-screen overflow-hidden flex flex-col bg-slate-50'
          : 'builder-workspace h-screen w-screen overflow-hidden flex flex-col bg-slate-50'
      }
    >
      <UnsavedChangesGuard isDirty={isDirty} />

      {!isPreviewMode ? (
        <BuilderToolbar
          projectId={id}
          projectName={projectName}
          isDirty={isDirty}
          websiteData={websiteData}
          isPreviewMode={isPreviewMode}
          onTogglePreview={() => setIsPreviewMode(true)}
          onProjectNameChange={(value) => {
            setProjectName(value);
            setSaveMessage('');
          }}
          onSave={handleSaveProject}
          saving={saving}
          saveMessage={saveMessage}
          saveError={saveError}
        />
      ) : null}

      {!isPreviewMode ? (
        <div
          className="builder-compact-tabs"
          role="tablist"
          aria-label="Builder panels"
        >
          {COMPACT_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={compactTab === tab.id}
              className={
                compactTab === tab.id
                  ? 'builder-compact-tab active'
                  : 'builder-compact-tab'
              }
              onClick={() => setCompactTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      ) : null}

      <div
        className={[
          'builder-workspace-body flex-1 min-h-0 overflow-hidden',
          showLeft ? '' : 'builder-workspace-body--left-closed',
          showRight ? '' : 'builder-workspace-body--right-closed',
          isPreviewMode ? 'builder-workspace-body--zen' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <aside
          className={[
            'builder-pane builder-pane--ai bg-white border-r border-gray-200',
            showLeft
              ? 'builder-pane--open w-80 overflow-y-auto'
              : 'builder-pane--closed',
          ].join(' ')}
          aria-label="AI assistant"
          aria-hidden={!showLeft}
          aria-expanded={showLeft}
        >
          {showLeft ? (
            <AiAssistantPanel
              selectedComponent={
                websiteData?.components?.find((item) => item.id === selectedBlockId) ||
                null
              }
              onApplyGeneratedText={handleApplyAiCopy}
              onGenerateFullWebsite={handleStreamWebsiteGenerate}
              isStreamingWebsite={isStreaming}
              onClose={() => setIsLeftOpen(false)}
            />
          ) : null}
        </aside>

        <section
          className={[
            'builder-pane builder-pane--preview relative flex-1 min-w-0 overflow-hidden',
            compactTab === 'preview' ? 'is-compact-active' : '',
            isPreviewMode
              ? 'builder-pane--preview-zen bg-white'
              : 'bg-slate-100 inset-shadow-sm flex items-center justify-center p-8',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-label="Live preview canvas"
        >
          {!isPreviewMode ? (
            <>
              <button
                type="button"
                className="builder-edge-toggle builder-edge-toggle--left"
                onClick={() => setIsLeftOpen((open) => !open)}
                aria-label={isLeftOpen ? 'Collapse left sidebar' : 'Expand left sidebar'}
                title={isLeftOpen ? 'Hide Copilot' : 'Show Copilot'}
              >
                <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  {isLeftOpen ? (
                    <path
                      fillRule="evenodd"
                      d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                      clipRule="evenodd"
                    />
                  ) : (
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  )}
                </svg>
              </button>
              <button
                type="button"
                className="builder-edge-toggle builder-edge-toggle--right"
                onClick={() => setIsRightOpen((open) => !open)}
                aria-label={
                  isRightOpen ? 'Collapse right sidebar' : 'Expand right sidebar'
                }
                title={isRightOpen ? 'Hide Editor' : 'Show Editor'}
              >
                <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  {isRightOpen ? (
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  ) : (
                    <path
                      fillRule="evenodd"
                      d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                      clipRule="evenodd"
                    />
                  )}
                </svg>
              </button>
            </>
          ) : null}

          <LivePreviewPanel
            websiteData={websiteData}
            onLoadSample={isPreviewMode ? null : handleLoadSample}
            zenMode={isPreviewMode}
            selectedBlockId={selectedBlockId}
            onSelectBlock={(blockId) => {
              setSelectedBlockId(blockId);
              setIsRightOpen(true);
              setCompactTab('editor');
            }}
          />

          {isStreaming ? (
            <div
              ref={terminalRef}
              className="absolute inset-0 z-30 bg-gray-900 text-emerald-400 font-mono p-8 overflow-y-auto whitespace-pre-wrap"
              aria-live="polite"
              aria-label="AI generation stream"
            >
              <div className="mb-4 flex items-center justify-between gap-3 text-emerald-300/80 text-xs uppercase tracking-widest">
                <span>WebStructura · Ollama stream</span>
                <button
                  type="button"
                  className="rounded border border-emerald-700/60 px-2 py-1 text-emerald-300 hover:bg-emerald-950"
                  onClick={() => streamAbortRef.current?.abort()}
                >
                  Cancel
                </button>
              </div>
              <pre className="m-0 whitespace-pre-wrap break-words text-sm leading-relaxed">
                {streamingText || 'Connecting to local AI…'}
                <span className="inline-block w-2 h-4 ml-0.5 bg-emerald-400 align-middle animate-pulse" />
              </pre>
            </div>
          ) : null}

          {isPreviewMode ? (
            <button
              type="button"
              className="builder-exit-preview"
              onClick={() => setIsPreviewMode(false)}
            >
              Exit Preview
            </button>
          ) : null}
        </section>

        <aside
          className={[
            'builder-pane builder-pane--editor bg-white border-l border-gray-200',
            showRight
              ? 'builder-pane--open w-80 overflow-y-auto'
              : 'builder-pane--closed',
            compactTab === 'editor' ? 'is-compact-active' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-label="Website editor"
          aria-hidden={!showRight}
        >
          {showRight ? (
            <WebsiteEditorPanel
              websiteData={websiteData}
              selectedBlockId={selectedBlockId}
              addType={addType}
              onSelect={setSelectedBlockId}
              onAddTypeChange={setAddType}
              onAddComponent={handleAddComponent}
              onRemoveComponent={handleRemoveComponent}
              onMoveComponent={moveComponent}
              onPropsChange={handlePropsChange}
              onThemeChange={handleThemeChange}
              onTitleChange={(value) => {
                setWebsiteData((current) => ({ ...current, title: value }));
                setSaveMessage('');
              }}
            />
          ) : null}
        </aside>
      </div>
    </div>
  );
}
