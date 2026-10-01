/**
 * Controlled prop editors for each whitelisted website component type.
 * Text fields debounce into websiteData to avoid focus loss / thrashing.
 */

import { useEffect, useRef } from 'react';
import {
  DebouncedTextArea,
  DebouncedTextInput,
  createEditorRowId,
  ensureRowId,
} from './DebouncedFields.jsx';

function usePersistRowIds(items, onChangeItems, scopeKey) {
  const doneForScope = useRef('');

  useEffect(() => {
    if (!scopeKey || doneForScope.current === scopeKey) {
      return;
    }

    const safe = Array.isArray(items) ? items : [];
    doneForScope.current = scopeKey;

    if (safe.some((item) => !item || typeof item._editorId !== 'string')) {
      onChangeItems(safe.map(ensureRowId));
    }
  }, [scopeKey, items, onChangeItems]);
}

function LinkListEditor({ links = [], onChange, scopeKey, title = 'Links' }) {
  const safeLinks = Array.isArray(links) ? links : [];
  usePersistRowIds(safeLinks, onChange, scopeKey);

  function updateLink(rowId, field, value) {
    onChange(
      safeLinks.map((link) =>
        link._editorId === rowId ? { ...link, [field]: value } : link,
      ),
    );
  }

  function addLink() {
    onChange([
      ...safeLinks,
      { _editorId: createEditorRowId(), label: 'New link', href: '#' },
    ]);
  }

  function removeLink(rowId) {
    onChange(safeLinks.filter((link) => link._editorId !== rowId));
  }

  return (
    <div className="builder-list">
      <div className="builder-list-header">
        <strong>{title}</strong>
        <button type="button" onClick={addLink}>
          Add link
        </button>
      </div>
      {safeLinks.map((link, index) => (
        <div
          key={link._editorId || `link-pending-${index}`}
          className="builder-list-item"
        >
          <DebouncedTextInput
            value={link.label || ''}
            onChange={(value) =>
              link._editorId
                ? updateLink(link._editorId, 'label', value)
                : null
            }
            placeholder="Label"
          />
          <DebouncedTextInput
            value={link.href || ''}
            onChange={(value) =>
              link._editorId
                ? updateLink(link._editorId, 'href', value)
                : null
            }
            placeholder="Href"
          />
          <button
            type="button"
            onClick={() => link._editorId && removeLink(link._editorId)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

function FooterColumnsEditor({ columns = [], onChange, scopeKey }) {
  const safeColumns = Array.isArray(columns) ? columns : [];
  usePersistRowIds(safeColumns, onChange, scopeKey);

  function updateColumn(rowId, field, value) {
    onChange(
      safeColumns.map((column) =>
        column._editorId === rowId ? { ...column, [field]: value } : column,
      ),
    );
  }

  function addColumn() {
    onChange([
      ...safeColumns,
      {
        _editorId: createEditorRowId(),
        title: 'New column',
        links: [{ _editorId: createEditorRowId(), label: 'Link', href: '#' }],
      },
    ]);
  }

  function removeColumn(rowId) {
    onChange(safeColumns.filter((column) => column._editorId !== rowId));
  }

  return (
    <div className="builder-list">
      <div className="builder-list-header">
        <strong>Footer columns</strong>
        <button type="button" onClick={addColumn}>
          Add column
        </button>
      </div>
      {safeColumns.map((column, index) => (
        <div
          key={column._editorId || `column-pending-${index}`}
          className="builder-list-item stacked"
        >
          <DebouncedTextInput
            label="Column title"
            value={column.title || ''}
            onChange={(value) =>
              column._editorId
                ? updateColumn(column._editorId, 'title', value)
                : null
            }
            placeholder="Product"
          />
          <LinkListEditor
            title="Column links"
            scopeKey={`${scopeKey}-${column._editorId || index}-links`}
            links={column.links}
            onChange={(value) =>
              column._editorId
                ? updateColumn(column._editorId, 'links', value)
                : null
            }
          />
          <button
            type="button"
            onClick={() => column._editorId && removeColumn(column._editorId)}
          >
            Remove column
          </button>
        </div>
      ))}
    </div>
  );
}

function ItemListEditor({
  items = [],
  fields,
  onChange,
  addLabel,
  createItem,
  scopeKey,
}) {
  const safeItems = Array.isArray(items) ? items : [];
  usePersistRowIds(safeItems, onChange, scopeKey);

  function updateItem(rowId, field, value) {
    onChange(
      safeItems.map((item) =>
        item._editorId === rowId ? { ...item, [field]: value } : item,
      ),
    );
  }

  function addItem() {
    onChange([
      ...safeItems,
      { ...createItem(), _editorId: createEditorRowId() },
    ]);
  }

  function removeItem(rowId) {
    onChange(safeItems.filter((item) => item._editorId !== rowId));
  }

  return (
    <div className="builder-list">
      <div className="builder-list-header">
        <strong>{addLabel}</strong>
        <button type="button" onClick={addItem}>
          Add
        </button>
      </div>
      {safeItems.map((item, index) => (
        <div
          key={item._editorId || `item-pending-${index}`}
          className="builder-list-item stacked"
        >
          {fields.map((field) =>
            field.multiline ? (
              <DebouncedTextArea
                key={`${item._editorId || index}-${field.name}`}
                rows={3}
                value={item[field.name] || ''}
                placeholder={field.label}
                onChange={(value) =>
                  item._editorId &&
                  updateItem(item._editorId, field.name, value)
                }
              />
            ) : (
              <DebouncedTextInput
                key={`${item._editorId || index}-${field.name}`}
                value={item[field.name] || ''}
                placeholder={field.label}
                onChange={(value) =>
                  item._editorId &&
                  updateItem(item._editorId, field.name, value)
                }
              />
            ),
          )}
          <button
            type="button"
            onClick={() => item._editorId && removeItem(item._editorId)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

export default function ComponentPropsEditor({ type, props, onChange, componentId }) {
  function setProp(key, value) {
    // Functional merge avoids stale-props races when two debounced fields commit close together
    onChange((prev) => ({ ...(prev || props || {}), [key]: value }));
  }

  switch (type) {
    case 'Navbar':
      return (
        <div className="component-props-editor">
          <DebouncedTextInput
            label="Brand"
            value={props.brand}
            onChange={(value) => setProp('brand', value)}
          />
          <LinkListEditor
            scopeKey={`${componentId}-links`}
            links={props.links}
            onChange={(value) => setProp('links', value)}
          />
        </div>
      );

    case 'Hero':
      return (
        <div className="component-props-editor">
          <DebouncedTextInput
            label="Title"
            value={props.title}
            onChange={(value) => setProp('title', value)}
          />
          <DebouncedTextArea
            label="Subtitle"
            value={props.subtitle}
            onChange={(value) => setProp('subtitle', value)}
          />
          <DebouncedTextInput
            label="CTA label"
            value={props.ctaLabel}
            onChange={(value) => setProp('ctaLabel', value)}
          />
          <DebouncedTextInput
            label="CTA link"
            value={props.ctaHref}
            onChange={(value) => setProp('ctaHref', value)}
          />
          <DebouncedTextInput
            label="Secondary CTA label"
            value={props.secondaryLabel}
            onChange={(value) => setProp('secondaryLabel', value)}
          />
          <DebouncedTextInput
            label="Secondary CTA link"
            value={props.secondaryHref}
            onChange={(value) => setProp('secondaryHref', value)}
          />
          <DebouncedTextInput
            label="Image keyword (e.g. cafeteria,food)"
            value={props.imageKeyword}
            onChange={(value) => setProp('imageKeyword', value)}
          />
          <DebouncedTextInput
            label="Image URL (optional override)"
            value={props.image}
            onChange={(value) => setProp('image', value)}
          />
          <DebouncedTextInput
            label="Image alt text"
            value={props.imageAlt}
            onChange={(value) => setProp('imageAlt', value)}
          />
        </div>
      );

    case 'About':
      return (
        <div className="component-props-editor">
          <DebouncedTextInput
            label="Heading"
            value={props.heading}
            onChange={(value) => setProp('heading', value)}
          />
          <DebouncedTextArea
            label="Body"
            value={props.body}
            onChange={(value) => setProp('body', value)}
          />
          <DebouncedTextInput
            label="Image keyword"
            value={props.imageKeyword}
            onChange={(value) => setProp('imageKeyword', value)}
          />
          <DebouncedTextInput
            label="Image URL (optional override)"
            value={props.image}
            onChange={(value) => setProp('image', value)}
          />
        </div>
      );

    case 'Skills':
      return (
        <div className="component-props-editor">
          <DebouncedTextInput
            label="Heading"
            value={props.heading}
            onChange={(value) => setProp('heading', value)}
          />
          <ItemListEditor
            scopeKey={`${componentId}-skills`}
            addLabel="Skills"
            items={props.items}
            onChange={(value) => setProp('items', value)}
            createItem={() => ({ name: 'New skill', level: 'Beginner' })}
            fields={[
              { name: 'name', label: 'Skill name' },
              { name: 'level', label: 'Level' },
            ]}
          />
        </div>
      );

    case 'Services':
      return (
        <div className="component-props-editor">
          <DebouncedTextInput
            label="Heading"
            value={props.heading}
            onChange={(value) => setProp('heading', value)}
          />
          <DebouncedTextInput
            label="Subheading"
            value={props.subheading}
            onChange={(value) => setProp('subheading', value)}
          />
          <ItemListEditor
            scopeKey={`${componentId}-services`}
            addLabel="Features"
            items={props.items}
            onChange={(value) => setProp('items', value)}
            createItem={() => ({
              title: 'New feature',
              description: 'Describe this feature.',
              imageKeyword: 'business',
            })}
            fields={[
              { name: 'title', label: 'Title' },
              { name: 'description', label: 'Description', multiline: true },
              { name: 'imageKeyword', label: 'Image keyword' },
              { name: 'image', label: 'Image URL (optional)' },
            ]}
          />
        </div>
      );

    case 'Projects':
      return (
        <div className="component-props-editor">
          <DebouncedTextInput
            label="Heading"
            value={props.heading}
            onChange={(value) => setProp('heading', value)}
          />
          <ItemListEditor
            scopeKey={`${componentId}-projects`}
            addLabel="Projects"
            items={props.items}
            onChange={(value) => setProp('items', value)}
            createItem={() => ({
              title: 'New project',
              description: 'Describe this project.',
              link: '#',
            })}
            fields={[
              { name: 'title', label: 'Title' },
              { name: 'description', label: 'Description', multiline: true },
              { name: 'link', label: 'Link' },
            ]}
          />
        </div>
      );

    case 'Testimonials':
      return (
        <div className="component-props-editor">
          <DebouncedTextInput
            label="Heading"
            value={props.heading}
            onChange={(value) => setProp('heading', value)}
          />
          <ItemListEditor
            scopeKey={`${componentId}-testimonials`}
            addLabel="Testimonials"
            items={props.items}
            onChange={(value) => setProp('items', value)}
            createItem={() => ({
              quote: 'A short quote about your work.',
              author: 'Name',
              role: 'Role',
            })}
            fields={[
              { name: 'quote', label: 'Quote', multiline: true },
              { name: 'author', label: 'Author' },
              { name: 'role', label: 'Role' },
            ]}
          />
        </div>
      );

    case 'Pricing': {
      const tiersForEditor = (Array.isArray(props.tiers) ? props.tiers : []).map(
        (tier) => ({
          ...tier,
          featuresText: Array.isArray(tier.features)
            ? tier.features.join('\n')
            : tier.featuresText || '',
        }),
      );

      return (
        <div className="component-props-editor">
          <DebouncedTextInput
            label="Heading"
            value={props.heading}
            onChange={(value) => setProp('heading', value)}
          />
          <DebouncedTextInput
            label="Subheading"
            value={props.subheading}
            onChange={(value) => setProp('subheading', value)}
          />
          <DebouncedTextInput
            label="Featured tier name"
            value={props.featuredTier}
            onChange={(value) => setProp('featuredTier', value)}
          />
          <ItemListEditor
            scopeKey={`${componentId}-pricing`}
            addLabel="Pricing tiers"
            items={tiersForEditor}
            onChange={(value) =>
              setProp(
                'tiers',
                value.map((tier) => ({
                  _editorId: tier._editorId,
                  name: tier.name || 'Plan',
                  price: tier.price || '$0',
                  period: tier.period || 'mo',
                  description: tier.description || '',
                  ctaLabel: tier.ctaLabel || 'Get started',
                  ctaHref: tier.ctaHref || '#contact',
                  highlighted:
                    String(tier.name || '')
                      .toLowerCase()
                      .trim() ===
                    String(props.featuredTier || 'Pro')
                      .toLowerCase()
                      .trim(),
                  features: String(tier.featuresText || '')
                    .split('\n')
                    .map((line) => line.trim())
                    .filter(Boolean),
                })),
              )
            }
            createItem={() => ({
              name: 'New plan',
              price: '$19',
              period: 'mo',
              description: 'Describe this plan.',
              featuresText: 'Feature one\nFeature two',
              ctaLabel: 'Choose plan',
              ctaHref: '#contact',
            })}
            fields={[
              { name: 'name', label: 'Tier name (use Pro to highlight)' },
              { name: 'price', label: 'Price' },
              { name: 'period', label: 'Period (mo / yr)' },
              { name: 'description', label: 'Description', multiline: true },
              {
                name: 'featuresText',
                label: 'Features (one per line)',
                multiline: true,
              },
              { name: 'ctaLabel', label: 'CTA label' },
              { name: 'ctaHref', label: 'CTA link' },
            ]}
          />
        </div>
      );
    }

    case 'FAQ':
      return (
        <div className="component-props-editor">
          <DebouncedTextInput
            label="Heading"
            value={props.heading}
            onChange={(value) => setProp('heading', value)}
          />
          <ItemListEditor
            scopeKey={`${componentId}-faq`}
            addLabel="FAQ items"
            items={props.items}
            onChange={(value) => setProp('items', value)}
            createItem={() => ({
              question: 'New question?',
              answer: 'Write a clear, helpful answer.',
            })}
            fields={[
              { name: 'question', label: 'Question' },
              { name: 'answer', label: 'Answer', multiline: true },
            ]}
          />
        </div>
      );

    case 'Gallery':
      return (
        <div className="component-props-editor">
          <DebouncedTextInput
            label="Heading"
            value={props.heading}
            onChange={(value) => setProp('heading', value)}
          />
          <DebouncedTextInput
            label="Subheading"
            value={props.subheading}
            onChange={(value) => setProp('subheading', value)}
          />
          <ItemListEditor
            scopeKey={`${componentId}-gallery`}
            addLabel="Images"
            items={props.images}
            onChange={(value) => setProp('images', value)}
            createItem={() => ({
              url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
              alt: 'Gallery image',
            })}
            fields={[
              { name: 'url', label: 'Image URL' },
              { name: 'alt', label: 'Alt text' },
            ]}
          />
        </div>
      );

    case 'CTA':
      return (
        <div className="component-props-editor">
          <DebouncedTextInput
            label="Heading"
            value={props.heading}
            onChange={(value) => setProp('heading', value)}
          />
          <DebouncedTextArea
            label="Body"
            value={props.body}
            onChange={(value) => setProp('body', value)}
          />
          <DebouncedTextInput
            label="Primary CTA label"
            value={props.ctaLabel}
            onChange={(value) => setProp('ctaLabel', value)}
          />
          <DebouncedTextInput
            label="Primary CTA link"
            value={props.ctaHref}
            onChange={(value) => setProp('ctaHref', value)}
          />
          <DebouncedTextInput
            label="Secondary CTA label"
            value={props.secondaryLabel}
            onChange={(value) => setProp('secondaryLabel', value)}
          />
          <DebouncedTextInput
            label="Secondary CTA link"
            value={props.secondaryHref}
            onChange={(value) => setProp('secondaryHref', value)}
          />
        </div>
      );

    case 'Contact':
      return (
        <div className="component-props-editor">
          <DebouncedTextInput
            label="Heading"
            value={props.heading}
            onChange={(value) => setProp('heading', value)}
          />
          <DebouncedTextArea
            label="Message"
            value={props.message}
            onChange={(value) => setProp('message', value)}
          />
          <DebouncedTextInput
            label="Email"
            value={props.email}
            onChange={(value) => setProp('email', value)}
          />
          <DebouncedTextInput
            label="Phone"
            value={props.phone}
            onChange={(value) => setProp('phone', value)}
          />
          <DebouncedTextInput
            label="Address"
            value={props.address}
            onChange={(value) => setProp('address', value)}
          />
        </div>
      );

    case 'Footer':
      return (
        <div className="component-props-editor">
          <DebouncedTextInput
            label="Copyright text"
            value={props.text}
            onChange={(value) => setProp('text', value)}
          />
          <FooterColumnsEditor
            scopeKey={`${componentId}-footer-columns`}
            columns={props.columns}
            onChange={(value) => setProp('columns', value)}
          />
        </div>
      );

    default:
      return <p className="error">Unsupported component type.</p>;
  }
}
