import { Link, useNavigate } from 'react-router-dom';
import { PROJECT_TEMPLATES } from '../website/templates.js';

function TemplateThumb({ accent, title, image }) {
  return (
    <div
      className={`template-thumb template-thumb--${accent} relative w-full h-48 bg-gray-100 overflow-hidden ${
        image ? '' : 'border-b border-gray-200 flex items-center justify-center'
      }`}
      aria-hidden="true"
    >
      {image ? (
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="template-thumb-browser shadow-lg shadow-black/10">
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
      )}
      <span className="absolute bottom-3 right-3 px-2.5 py-1 text-[10px] sm:text-xs font-bold tracking-wider uppercase text-white bg-black/40 backdrop-blur-md rounded-md z-10 border border-white/10 shadow-sm">
        {title}
      </span>
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
    <section className="template-gallery-page min-h-screen bg-gray-50/50 py-10 px-6 lg:px-8 max-w-[1600px] mx-auto">
      <div className="page-header mb-12 pb-8 border-b border-gray-200 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="min-w-0">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 m-0">
            Template Gallery
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl leading-relaxed m-0">
            Start from a polished layout instead of an empty project. Pick a
            template, name your site, and jump straight into the builder.
          </p>
        </div>
        <div className="template-gallery-actions flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0">
          <Link
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
            to="/dashboard"
          >
            Back to dashboard
          </Link>
          <Link
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
            to="/projects/new"
          >
            Blank project
          </Link>
        </div>
      </div>

      <div className="template-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {PROJECT_TEMPLATES.map((template) => (
          <article
            key={template.id}
            className="template-card group flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-200 hover:border-emerald-300 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <TemplateThumb
              accent={template.accent}
              image={template.image}
              title={template.title}
            />

            <div className="template-card-body p-6 flex flex-col flex-1">
              <div className="template-card-tags flex flex-wrap gap-2 mb-4">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="template-tag px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="template-card-title text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors m-0 tracking-tight">
                {template.title}
              </h2>
              <p className="template-card-description text-sm text-gray-600 leading-relaxed mb-6 flex-1 m-0">
                {template.description}
              </p>
              <button
                type="button"
                className="w-full py-3 px-4 bg-gray-50 hover:bg-emerald-600 text-gray-900 hover:text-white font-medium rounded-xl transition-colors duration-200 border border-gray-200 hover:border-transparent"
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
