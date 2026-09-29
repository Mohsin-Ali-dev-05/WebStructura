import { COMPONENT_MAP } from './components/index.js';
import MotionSection from './MotionSection.jsx';
import { sanitizeComponentProps } from './sanitizeProps.js';

/**
 * Maps a JSON array of website blocks to whitelisted React sections.
 * When `interactive` is true (builder canvas), blocks are click-selectable.
 */
export default function ComponentRenderer({
  components = [],
  className = '',
  interactive = false,
  selectedBlockId = '',
  onSelectBlock,
}) {
  const blocks = Array.isArray(components) ? components : [];

  if (blocks.length === 0) {
    return (
      <div className={`ws-empty ${className}`.trim()}>
        <p>This website has no components yet. Add some in the builder.</p>
      </div>
    );
  }

  return (
    <div className={`ws-component-stack ${className}`.trim()}>
      {blocks.map((block, index) => {
        if (!block || typeof block !== 'object') {
          return null;
        }

        const Component = COMPONENT_MAP[block.type];

        if (!Component) {
          return null;
        }

        const blockId =
          typeof block.id === 'string' && block.id
            ? block.id
            : `${block.type}-${index}`;
        const rawProps =
          block.props &&
          typeof block.props === 'object' &&
          !Array.isArray(block.props)
            ? block.props
            : {};
        const props = sanitizeComponentProps(rawProps);
        const isSelected = interactive && selectedBlockId === blockId;

        const section = (
          <MotionSection delay={Math.min(index * 0.05, 0.25)}>
            <Component {...props} />
          </MotionSection>
        );

        if (!interactive) {
          return <div key={blockId}>{section}</div>;
        }

        return (
          <div
            key={blockId}
            data-block-id={blockId}
            data-block-type={block.type}
            className={[
              'ws-block-selectable',
              'relative transition-all duration-150',
              'hover:ring-2 hover:ring-blue-400/50 hover:cursor-pointer',
              isSelected ? 'is-selected ring-2 ring-blue-500' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              if (typeof onSelectBlock === 'function') {
                onSelectBlock(blockId);
              }
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                event.stopPropagation();
                if (typeof onSelectBlock === 'function') {
                  onSelectBlock(blockId);
                }
              }
            }}
            role="button"
            tabIndex={0}
            aria-pressed={isSelected}
            aria-label={`Select ${block.type} block`}
          >
            {section}
          </div>
        );
      })}
    </div>
  );
}
