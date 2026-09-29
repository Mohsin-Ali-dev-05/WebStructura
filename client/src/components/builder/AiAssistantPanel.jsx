import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { generateSection } from '../../services/aiService.js';

const SECTION_OPTIONS = ['Hero', 'About', 'Services', 'Contact', 'Footer'];

function SparklesIcon({ className = 'w-4 h-4' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.25c.28 0 .53.17.64.43l1.2 2.98a1.5 1.5 0 001.02 1.02l2.98 1.2a.7.7 0 010 1.28l-2.98 1.2a1.5 1.5 0 00-1.02 1.02l-1.2 2.98a.7.7 0 01-1.28 0l-1.2-2.98a1.5 1.5 0 00-1.02-1.02l-2.98-1.2a.7.7 0 010-1.28l2.98-1.2a1.5 1.5 0 001.02-1.02l1.2-2.98A.7.7 0 0112 2.25z" />
      <path d="M18.75 13.5a.6.6 0 01.55.36l.55 1.28c.1.23.28.41.51.51l1.28.55a.6.6 0 010 1.1l-1.28.55a.9.9 0 00-.51.51l-.55 1.28a.6.6 0 01-1.1 0l-.55-1.28a.9.9 0 00-.51-.51l-1.28-.55a.6.6 0 010-1.1l1.28-.55a.9.9 0 00.51-.51l.55-1.28a.6.6 0 01.55-.36z" />
      <path d="M5.25 14.25a.55.55 0 01.5.33l.4.93c.08.19.23.34.42.42l.93.4a.55.55 0 010 1.02l-.93.4a.7.7 0 00-.42.42l-.4.93a.55.55 0 01-1.02 0l-.4-.93a.7.7 0 00-.42-.42l-.93-.4a.55.55 0 010-1.02l.93-.4a.7.7 0 00.42-.42l.4-.93a.55.55 0 01.52-.33z" />
    </svg>
  );
}

/**
 * Maps generated copy onto the correct prop for a component type.
 * Live preview updates when websiteData.components props change.
 */
export function applyCopyToComponentProps(type, props = {}, text) {
  const next = { ...(props && typeof props === 'object' ? props : {}) };
  const copy = String(text || '').trim();

  switch (type) {
    case 'Hero':
      next.subtitle = copy;
      break;
    case 'About':
      next.heading = next.heading || 'About';
      next.body = copy;
      break;
    case 'Services': {
      next.heading = next.heading || 'Services';
      if (Array.isArray(next.items) && next.items.length > 0) {
        next.items = next.items.map((item, index) =>
          index === 0
            ? { ...item, description: copy }
            : item,
        );
      } else {
        next.items = [{ title: 'Featured offering', description: copy }];
      }
      break;
    }
    case 'Contact':
      next.heading = next.heading || 'Contact';
      next.message = copy;
      break;
    case 'Footer':
      next.text = copy;
      break;
    case 'CTA':
      next.body = copy;
      break;
    case 'FAQ':
      if (Array.isArray(next.items) && next.items[0]) {
        next.items = next.items.map((item, index) =>
          index === 0 ? { ...item, answer: copy } : item,
        );
      } else {
        next.items = [{ question: 'New question?', answer: copy }];
      }
      break;
    default:
      if ('subtitle' in next) {
        next.subtitle = copy;
      } else if ('body' in next) {
        next.body = copy;
      } else if ('text' in next) {
        next.text = copy;
      } else if ('message' in next) {
        next.message = copy;
      } else {
        next.body = copy;
      }
  }

  return next;
}

/**
 * Copywriting Copilot — generates draft text, lets the user copy or apply
 * it to the selected / matching section (never auto-injects new blocks).
 */
export default function AiAssistantPanel({
  selectedComponent = null,
  onApplyGeneratedText,
  onClose,
}) {
  const [prompt, setPrompt] = useState('');
  const [sectionType, setSectionType] = useState('Hero');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [copyLabel, setCopyLabel] = useState('Copy text');

  useEffect(() => {
    if (
      selectedComponent?.type &&
      SECTION_OPTIONS.includes(selectedComponent.type)
    ) {
      setSectionType(selectedComponent.type);
    }
  }, [selectedComponent?.id, selectedComponent?.type]);

  useEffect(() => {
    if (copyLabel === 'Copied!') {
      const timer = window.setTimeout(() => {
        setCopyLabel('Copy text');
      }, 2000);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [copyLabel]);

  async function handleGenerate(event) {
    event.preventDefault();

    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || isLoading) {
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Drafting copy…');

    try {
      const data = await generateSection({
        prompt: trimmedPrompt,
        sectionType,
      });

      const text =
        (typeof data?.data?.text === 'string' && data.data.text.trim()) ||
        (typeof data?.text === 'string' && data.text.trim()) ||
        '';

      if (!data?.success || !text) {
        throw new Error('The AI service returned an empty draft.');
      }

      setGeneratedText(text);
      toast.success('Draft ready — review, copy, or apply.', {
        id: toastId,
        duration: 3000,
      });
    } catch (error) {
      const raw = error?.message || '';
      const offlineHint =
        /failed to fetch|networkerror|econnrefused|timeout|aborted|ollama/i.test(
          raw,
        );
      toast.error(
        offlineHint
          ? 'AI is offline. Start the API and Ollama, then try again.'
          : raw || 'Unable to generate content. Please try again.',
        { id: toastId, duration: 4500 },
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopy() {
    if (!generatedText.trim()) {
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedText);
      setCopyLabel('Copied!');
      toast.success('Copied to clipboard!');
    } catch {
      toast.error('Could not copy to clipboard.');
    }
  }

  function handleApply() {
    if (!generatedText.trim()) {
      return;
    }

    if (typeof onApplyGeneratedText !== 'function') {
      toast.error('Builder is not ready to apply copy.');
      return;
    }

    const applied = onApplyGeneratedText(generatedText, sectionType);
    if (applied === false) {
      return;
    }
  }

  function handleClear() {
    setGeneratedText('');
    setPrompt('');
    setCopyLabel('Copy text');
  }

  const selectClassName =
    'w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all disabled:cursor-not-allowed disabled:opacity-70';

  const targetHint = selectedComponent
    ? `Selected: ${selectedComponent.type}`
    : `Will match first ${sectionType} section`;

  return (
    <section
      className="ai-assistant-panel bg-white border-r border-gray-200 p-6 flex flex-col h-full min-h-full overflow-y-auto space-y-6"
      aria-label="AI copywriting assistant"
    >
      <header className="space-y-2 pb-6 border-b border-gray-200">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-gray-900 m-0">
            Copywriting Copilot
          </h2>
          <div className="flex items-center gap-2 shrink-0">
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
              Local AI
            </span>
            {typeof onClose === 'function' ? (
              <button
                type="button"
                className="ai-panel-close inline-flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1 rounded-md transition-colors"
                onClick={onClose}
                aria-label="Close AI Assistant"
                title="Close AI panel"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            ) : null}
          </div>
        </div>
        <p className="text-xs text-gray-500 m-0">{targetHint}</p>
      </header>

      <form
        className="flex flex-col space-y-6 flex-1 min-h-0"
        onSubmit={handleGenerate}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="ai-section-type"
              className="text-xs font-semibold text-gray-500 uppercase tracking-wide block"
            >
              Section type
            </label>
            <select
              id="ai-section-type"
              className={selectClassName}
              value={sectionType}
              onChange={(event) => setSectionType(event.target.value)}
              disabled={isLoading}
            >
              {SECTION_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="ai-prompt"
                className="text-xs font-semibold text-gray-500 uppercase tracking-wide block"
              >
                Prompt
              </label>
              <button
                type="button"
                className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
                onClick={handleClear}
                disabled={isLoading || (!prompt && !generatedText)}
              >
                Clear
              </button>
            </div>
            <textarea
              id="ai-prompt"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all resize-none h-28 disabled:cursor-not-allowed disabled:opacity-70"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Describe the tone and message you want…"
              disabled={isLoading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-xl shadow-sm transition-all flex justify-center items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <SparklesIcon className="w-4 h-4" />
          {isLoading ? 'Generating…' : 'Generate'}
        </button>

        {generatedText ? (
          <div className="ai-copy-preview bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Draft preview
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
              >
                {copyLabel}
              </button>
            </div>

            <div
              className="text-sm text-gray-700 leading-relaxed max-h-40 overflow-y-auto pr-1 whitespace-pre-wrap"
              role="region"
              aria-label="Generated draft"
            >
              {generatedText}
            </div>

            <button
              type="button"
              onClick={handleApply}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2.5 text-sm font-medium shadow-sm transition-all hover:bg-emerald-100"
            >
              Apply to Selected Section
            </button>
          </div>
        ) : null}
      </form>
    </section>
  );
}
