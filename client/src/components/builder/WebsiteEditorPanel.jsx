import { useEffect, useRef, useState } from 'react';
import { COMPONENT_TYPES } from '../../website/schema.js';
import BuilderStateMessage from './BuilderStateMessage.jsx';
import ComponentPropsEditor from './ComponentPropsEditor.jsx';
import { DebouncedTextInput } from './DebouncedFields.jsx';

const ACCORDION_IDS = {
  theme: 'theme',
  structure: 'structure',
  props: 'props',
};

const LABEL_CLASS =
  'text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block';

const INPUT_CLASS =
  'editor-control bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm';

function AccordionSection({ id, title, openId, onToggle, children, badge }) {
  const isOpen = openId === id;

  return (
    <div
      className={
        isOpen
          ? 'editor-accordion open border-b border-gray-100 py-4'
          : 'editor-accordion border-b border-gray-100 py-4'
      }
    >
      <button
        type="button"
        className="editor-accordion-trigger"
        aria-expanded={isOpen}
        aria-controls={`editor-accordion-panel-${id}`}
        id={`editor-accordion-${id}`}
        onClick={() => onToggle(id)}
      >
        <span className="editor-accordion-title">{title}</span>
        {badge ? (
          <span className="editor-accordion-badge bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
            {badge}
          </span>
        ) : null}
        <span className="editor-accordion-chevron" aria-hidden="true">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      {isOpen ? (
        <div
          className="editor-accordion-panel space-y-4"
          id={`editor-accordion-panel-${id}`}
          role="region"
          aria-labelledby={`editor-accordion-${id}`}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Right-hand builder editor — accordion layout to keep the canvas roomy.
 * Only one section is expanded at a time.
 */
export default function WebsiteEditorPanel({
  websiteData,
  selectedBlockId,
  addType,
  onSelect,
  onAddTypeChange,
  onAddComponent,
  onRemoveComponent,
  onMoveComponent,
  onPropsChange,
  onThemeChange,
  onTitleChange,
}) {
  const [openAccordion, setOpenAccordion] = useState(ACCORDION_IDS.theme);
  const propsPanelRef = useRef(null);
  const components = websiteData?.components || [];
  const selectedComponent = components.find(
    (item) => item.id === selectedBlockId,
  );

  useEffect(() => {
    if (!selectedBlockId) {
      return;
    }

    setOpenAccordion(ACCORDION_IDS.props);

    const frame = window.requestAnimationFrame(() => {
      propsPanelRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [selectedBlockId]);

  function handleToggle(id) {
    setOpenAccordion((current) => (current === id ? current : id));
  }

  return (
    <section
      className="builder-panel website-editor-panel w-80"
      aria-label="Website editor"
    >
      <div className="builder-panel-header">
        <h2>Editor</h2>
        <span className="builder-badge builder-badge--muted bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
          {components.length} component{components.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="editor-scroll editor-accordion-stack">
        <AccordionSection
          id={ACCORDION_IDS.theme}
          title="Theme Settings"
          openId={openAccordion}
          onToggle={handleToggle}
        >
          <DebouncedTextInput
            label="Website title"
            value={websiteData.title || ''}
            onChange={onTitleChange}
          />
          <label className="builder-field">
            <span className={LABEL_CLASS}>Primary color</span>
            <input
              className={INPUT_CLASS}
              type="color"
              value={websiteData.theme?.primaryColor || '#1d4ed8'}
              onChange={(event) =>
                onThemeChange('primaryColor', event.target.value)
              }
            />
          </label>
          <label className="builder-field">
            <span className={LABEL_CLASS}>Background</span>
            <input
              className={INPUT_CLASS}
              type="color"
              value={websiteData.theme?.backgroundColor || '#ffffff'}
              onChange={(event) =>
                onThemeChange('backgroundColor', event.target.value)
              }
            />
          </label>
          <label className="builder-field">
            <span className={LABEL_CLASS}>Text color</span>
            <input
              className={INPUT_CLASS}
              type="color"
              value={websiteData.theme?.textColor || '#14213d'}
              onChange={(event) =>
                onThemeChange('textColor', event.target.value)
              }
            />
          </label>
        </AccordionSection>

        <AccordionSection
          id={ACCORDION_IDS.structure}
          title="Page Structure"
          openId={openAccordion}
          onToggle={handleToggle}
          badge={String(components.length)}
        >
          {components.length === 0 ? (
            <BuilderStateMessage variant="empty" title="No components yet">
              <p>
                Choose a type below and click Add to start building your page.
              </p>
            </BuilderStateMessage>
          ) : (
            <ul className="builder-component-list">
              {components.map((item, index) => (
                <li
                  key={item.id}
                  className={
                    item.id === selectedBlockId
                      ? 'builder-component-row active'
                      : 'builder-component-row'
                  }
                >
                  <button
                    type="button"
                    className="builder-component"
                    onClick={() => {
                      onSelect(item.id);
                      setOpenAccordion(ACCORDION_IDS.props);
                    }}
                  >
                    <span className="builder-component-index">{index + 1}</span>
                    <span className="builder-component-type">{item.type}</span>
                  </button>
                  <div className="builder-component-tools">
                    <button
                      type="button"
                      className="builder-tool-btn builder-tool-btn--move"
                      title="Move up"
                      aria-label={`Move ${item.type} up`}
                      disabled={index === 0}
                      onClick={() => onMoveComponent(item.id, -1)}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="builder-tool-btn builder-tool-btn--move"
                      title="Move down"
                      aria-label={`Move ${item.type} down`}
                      disabled={index === components.length - 1}
                      onClick={() => onMoveComponent(item.id, 1)}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="builder-tool-btn builder-tool-btn--danger"
                      title="Remove"
                      aria-label={`Remove ${item.type}`}
                      onClick={() => onRemoveComponent(item.id)}
                    >
                      ×
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="builder-add">
            <select
              className={INPUT_CLASS}
              value={addType}
              onChange={(event) => onAddTypeChange(event.target.value)}
              aria-label="Component type to add"
            >
              {COMPONENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <button type="button" className="builder-add-btn" onClick={onAddComponent}>
              Add
            </button>
          </div>
        </AccordionSection>

        <div ref={propsPanelRef}>
          <AccordionSection
            id={ACCORDION_IDS.props}
            title="Component Settings"
            openId={openAccordion}
            onToggle={handleToggle}
            badge={selectedComponent ? selectedComponent.type : null}
          >
            {selectedComponent ? (
              <ComponentPropsEditor
                key={selectedComponent.id}
                componentId={selectedComponent.id}
                type={selectedComponent.type}
                props={selectedComponent.props}
                onChange={onPropsChange}
              />
            ) : (
              <BuilderStateMessage variant="empty" title="Nothing selected">
                <p>
                  Click a section on the canvas or choose one from Page
                  Structure to edit its content.
                </p>
              </BuilderStateMessage>
            )}
          </AccordionSection>
        </div>
      </div>
    </section>
  );
}
