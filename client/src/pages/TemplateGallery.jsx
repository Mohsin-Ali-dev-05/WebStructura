import { Link, useNavigate } from 'react-router-dom';
import templateVisual from '../assets/template.jpg';
import { PROJECT_TEMPLATES } from '../website/templates.js';

function TemplateThumb({ accent, title }) {
  return (
    <div className={`template-thumb template-thumb--${accent}`} aria-hidden="true">
      <div className="template-thumb-browser">
        <div className="template-thumb-dots">
          <span />
          <span />
          <span />
        </div>
        <div className="template-thumb-body">
          <div className="template-thumb-nav" />
          <div className="template-thumb-hero" />
          <div className="template-thumb-rows">
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>
      <span className="template-thumb-label">{title}</span>
    </div>
  );
}

export default function TemplateGallery() {
  const navigate = useNavigate();

  function handleUseTemplate(template) {
    navigate('/projects/new', {
      state: {
        template: {
          id: template.id,
          title: template.title,
          suggestedName: template.suggestedName,
          suggestedDescription: template.suggestedDescription,
          // Clone so create-form edits never mutate the shared catalog
          websiteData: JSON.parse(JSON.stringify(template.websiteData)),
        },
      },
    });
  }

  return (
    <section className="template-gallery-page">
      <div className="page-header">
        <div>
          <p className="page-kicker">Starters</p>
          <h1 className="tracking-tight">Template Gallery</h1>
          <p className="page-subtitle leading-relaxed">
            Start from a polished layout instead of an empty project. Pick a
            template, name your site, and jump straight into the builder.
          </p>
        </div>
        <div className="template-gallery-actions">
          <Link className="btn btn-ghost-dark" to="/dashboard">
            Back to dashboard
          </Link>
          <Link className="btn btn-secondary" to="/projects/new">
            Blank project
          </Link>
        </div>
      </div>

      <img
        src={templateVisual}
        alt="WebStructura template gallery preview"
        className="template-gallery-hero w-full max-w-md mx-auto max-h-48 h-auto rounded-xl shadow-sm border border-gray-200 object-contain mb-8"
      />

      <div className="template-grid">
        {PROJECT_TEMPLATES.map((template) => (
          <article key={template.id} className="ui-card template-card">
            <TemplateThumb accent={template.accent} title={template.title} />

            <div className="template-card-body">
              <div className="template-card-tags">
                {template.tags.map((tag) => (
                  <span key={tag} className="template-tag">
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="template-card-title tracking-tight">
                {template.title}
              </h2>
              <p className="template-card-description leading-relaxed">
                {template.description}
              </p>
              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={() => handleUseTemplate(template)}
              >
                Use Template
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
