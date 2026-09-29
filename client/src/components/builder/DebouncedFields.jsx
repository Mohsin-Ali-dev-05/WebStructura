import { useEffect, useRef, useState } from 'react';

const DEBOUNCE_MS = 300;

/**
 * Text/textarea with local state; commits to parent after idle typing.
 * Prevents global websiteData updates (and preview re-renders) on every keystroke.
 */
export function DebouncedTextInput({
  label,
  value,
  onChange,
  type = 'text',
  debounceMs = DEBOUNCE_MS,
  placeholder,
}) {
  const [localValue, setLocalValue] = useState(() => value ?? '');
  const onChangeRef = useRef(onChange);
  const externalValue = value ?? '';

  onChangeRef.current = onChange;

  useEffect(() => {
    setLocalValue(externalValue);
  }, [externalValue]);

  useEffect(() => {
    if (localValue === externalValue) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      onChangeRef.current(localValue);
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [localValue, externalValue, debounceMs]);

  function commitNow() {
    if (localValue !== externalValue) {
      onChangeRef.current(localValue);
    }
  }

  return (
    <label className="builder-field">
      {label ? (
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
          {label}
        </span>
      ) : null}
      <input
        type={type}
        className="editor-control bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm"
        value={localValue}
        placeholder={placeholder}
        onChange={(event) => setLocalValue(event.target.value)}
        onBlur={commitNow}
      />
    </label>
  );
}

export function DebouncedTextArea({
  label,
  value,
  onChange,
  rows = 4,
  debounceMs = DEBOUNCE_MS,
  placeholder,
}) {
  const [localValue, setLocalValue] = useState(() => value ?? '');
  const onChangeRef = useRef(onChange);
  const externalValue = value ?? '';

  onChangeRef.current = onChange;

  useEffect(() => {
    setLocalValue(externalValue);
  }, [externalValue]);

  useEffect(() => {
    if (localValue === externalValue) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      onChangeRef.current(localValue);
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [localValue, externalValue, debounceMs]);

  function commitNow() {
    if (localValue !== externalValue) {
      onChangeRef.current(localValue);
    }
  }

  return (
    <label className="builder-field">
      {label ? (
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
          {label}
        </span>
      ) : null}
      <textarea
        rows={rows}
        className="editor-control bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm resize-y"
        value={localValue}
        placeholder={placeholder}
        onChange={(event) => setLocalValue(event.target.value)}
        onBlur={commitNow}
      />
    </label>
  );
}

/** Stable id for nested list rows (links / items) — never use array index alone. */
export function createEditorRowId() {
  return `row_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function ensureRowId(item) {
  if (item && typeof item === 'object' && typeof item._editorId === 'string') {
    return item;
  }
  return { ...item, _editorId: createEditorRowId() };
}
