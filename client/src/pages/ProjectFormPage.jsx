import { useEffect, useId, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button, Card, INPUT_BASE_CLASS, LABEL_CLASS } from '../components/ui/index.js';
import {
  createProject,
  getProject,
  updateProject,
} from '../services/projectService.js';
import { getApiErrorMessage } from '../utils/formValidation.js';
import {
  createDefaultWebsiteData,
  normalizeWebsiteData,
} from '../website/schema.js';

const emptyForm = {
  name: '',
  description: '',
  status: 'draft',
};

/** Server AI generate + save can take ~20s; abort after 2 minutes. */
const AI_CREATE_TIMEOUT_MS = 120_000;

const NAME_MAX = 100;
const DESCRIPTION_MAX = 500;

function CloseIcon({ className = 'w-5 h-5' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  );
}

function SparkleIcon({ className = 'w-5 h-5' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.39c-.836.069-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.494c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.3-1.582-.536-1.65l-4.752-.391-1.831-4.401Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function LayoutIcon({ className = 'w-5 h-5' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M4.25 2A2.25 2.25 0 0 0 2 4.25v11.5A2.25 2.25 0 0 0 4.25 18h11.5A2.25 2.25 0 0 0 18 15.75V4.25A2.25 2.25 0 0 0 15.75 2H4.25ZM3.5 4.25a.75.75 0 0 1 .75-.75h11.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-.75.75H4.25a.75.75 0 0 1-.75-.75v-5.5Zm0 8a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1-.75-.75v-3.5Zm8 0a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1-.75-.75v-3.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function ProjectFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedTemplate = !isEdit ? location.state?.template || null : null;
  const willUseAi = !isEdit && !selectedTemplate;
  const nameId = useId();
  const descriptionId = useId();

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const formLocked = submitting || isGenerating;
  const nameLength = form.name.length;
  const descriptionLength = form.description.length;

  useEffect(() => {
    if (isEdit || !selectedTemplate) {
      return;
    }

    setForm({
      name: selectedTemplate.suggestedName || '',
      description: selectedTemplate.suggestedDescription || '',
      status: 'draft',
    });
  }, [isEdit, selectedTemplate]);

  useEffect(() => {
    if (!isEdit) {
      return undefined;
    }

    let cancelled = false;

    async function loadProject() {
      try {
        const response = await getProject(id);
        if (!cancelled) {
          const project = response.data.project;
          setForm({
            name: project.name || '',
            description: project.description || '',
            status: project.status || 'draft',
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(getApiErrorMessage(err, 'Could not load project.'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProject();

    return () => {
      cancelled = true;
    };
  }, [id, isEdit]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function setStatus(nextStatus) {
    if (formLocked) {
      return;
    }
    setForm((current) => ({ ...current, status: nextStatus }));
  }

  function resolveWebsiteData(projectName) {
    if (selectedTemplate?.websiteData) {
      return normalizeWebsiteData({
        ...selectedTemplate.websiteData,
        title: projectName,
      });
    }

    return createDefaultWebsiteData(projectName);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (formLocked) {
      return;
    }

    setError('');

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      status: form.status,
    };

    if (isEdit) {
      setSubmitting(true);
      try {
        await updateProject(id, payload);
        toast.success('Project saved successfully.', { duration: 3000 });
        navigate('/dashboard', { replace: true });
      } catch (err) {
        const message = getApiErrorMessage(
          err,
          'Unable to complete action. Please try again.',
        );
        setError(message);
        toast.error(message, { duration: 4000 });
      } finally {
        setSubmitting(false);
      }
      return;
    }

    const createPayload = selectedTemplate?.websiteData
      ? {
          ...payload,
          websiteData: resolveWebsiteData(payload.name),
          templateType:
            selectedTemplate.title ||
            selectedTemplate.id ||
            selectedTemplate.name ||
            'Template',
          thumbnailUrl: selectedTemplate.thumbnailUrl || '',
        }
      : {
          ...payload,
          templateType: 'Custom',
        };

    let loadingToastId;

    if (willUseAi) {
      setIsGenerating(true);
      loadingToastId = toast.loading(
        'AI is building your website… This can take about 20 seconds.',
        { duration: Infinity },
      );
    } else {
      setSubmitting(true);
      loadingToastId = toast.loading('Creating your project…', {
        duration: Infinity,
      });
    }

    try {
      const response = await createProject(createPayload, {
        timeoutMs: willUseAi ? AI_CREATE_TIMEOUT_MS : 30_000,
      });

      const projectId = response?.data?.project?.id;
      if (!projectId) {
        throw new Error('Project was created but no ID was returned.');
      }

      toast.success(
        willUseAi
          ? 'Your AI-built website is ready!'
          : 'Project created successfully.',
        { id: loadingToastId, duration: 3000 },
      );

      setIsGenerating(false);
      setSubmitting(false);
      navigate(`/projects/${projectId}/builder`, { replace: true });
    } catch (err) {
      const timedOut =
        err?.code === 'TIMEOUT' ||
        err?.name === 'TimeoutError' ||
        /timed out/i.test(err?.message || '');

      const message = timedOut
        ? 'AI generation timed out. Check that Ollama is running, then try again.'
        : getApiErrorMessage(
            err,
            'Unable to create the project. Please try again.',
          );

      setError(message);
      toast.error(message, { id: loadingToastId, duration: 5000 });
      setIsGenerating(false);
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="project-form-page form-page">
        <div className="project-form-shell" aria-busy="true">
          <div className="project-form-loading">
            <span className="auth-session-spinner" aria-hidden="true" />
            <p className="page-message">Loading project…</p>
          </div>
        </div>
      </main>
    );
  }

  let submitLabel = 'Create project';
  if (isEdit) {
    submitLabel = submitting ? 'Saving…' : 'Save changes';
  } else if (isGenerating) {
    submitLabel = 'Building your website…';
  } else if (submitting) {
    submitLabel = 'Creating…';
  } else if (willUseAi) {
    submitLabel = 'Generate with AI';
  } else if (selectedTemplate) {
    submitLabel = 'Open in builder';
  }

  const pageTitle = isEdit ? 'Edit project' : 'Create a project';
  const pageSubtitle = isEdit
    ? 'Update the name, description, or status of this website project.'
    : selectedTemplate
      ? `Starting from “${selectedTemplate.title}”. Confirm the details below to open the builder.`
      : 'Name your site, then let local AI draft the first layout — usually about 20 seconds.';

  return (
    <main className="project-form-page form-page">
      <div className="project-form-shell">
        <nav className="project-form-breadcrumb" aria-label="Breadcrumb">
          <Link to="/dashboard" className="project-form-breadcrumb-link">
            Dashboard
          </Link>
          <span className="project-form-breadcrumb-sep" aria-hidden="true">
            /
          </span>
          <span className="project-form-breadcrumb-current">
            {isEdit ? 'Edit project' : 'New project'}
          </span>
        </nav>

        <header className="project-form-hero">
          <div className="project-form-hero-copy">
            <p className="page-kicker">
              {isEdit ? 'Project settings' : 'New website'}
            </p>
            <h1>{pageTitle}</h1>
            <p className="page-subtitle">{pageSubtitle}</p>
          </div>
          <Link
            to="/dashboard"
            className="project-form-close"
            aria-label="Close and return to dashboard"
          >
            <CloseIcon />
          </Link>
        </header>

        {!isEdit && !selectedTemplate ? (
          <div className="project-form-paths" role="group" aria-label="Start options">
            <div className="project-form-path project-form-path--active" aria-current="true">
              <span className="project-form-path-icon" aria-hidden="true">
                <SparkleIcon />
              </span>
              <div className="min-w-0">
                <strong>Generate with AI</strong>
                <p>Describe the project below. Ollama drafts sections for you.</p>
              </div>
            </div>
            <Link to="/templates" className="project-form-path">
              <span className="project-form-path-icon" aria-hidden="true">
                <LayoutIcon />
              </span>
              <div className="min-w-0">
                <strong>Start from a template</strong>
                <p>Pick a ready layout, then customize in the builder.</p>
              </div>
            </Link>
          </div>
        ) : null}

        {!isEdit && selectedTemplate ? (
          <div className="project-form-template-banner">
            <div className="min-w-0">
              <p className="template-selected-label">Selected template</p>
              <strong>{selectedTemplate.title}</strong>
              {selectedTemplate.suggestedDescription ? (
                <p className="project-form-template-blurb">
                  {selectedTemplate.suggestedDescription}
                </p>
              ) : null}
            </div>
            <Link className="project-form-template-change" to="/templates">
              Change
            </Link>
          </div>
        ) : null}

        <Card as="form" className="project-form-card space-y-6" onSubmit={handleSubmit}>
          {error ? (
            <p className="project-form-error" role="alert">
              {error}
            </p>
          ) : null}

          {isGenerating ? (
            <div className="project-form-generating" role="status" aria-live="polite">
              <span className="auth-session-spinner" aria-hidden="true" />
              <div className="min-w-0">
                <strong>AI is drafting your site</strong>
                <p>
                  Keep this tab open. You&apos;ll land in the builder when generation
                  finishes.
                </p>
              </div>
            </div>
          ) : null}

          <label className="project-form-field" htmlFor={nameId}>
            <span className="project-form-field-head">
              <span className={LABEL_CLASS}>Project name</span>
              <span className="project-form-count" aria-hidden="true">
                {nameLength}/{NAME_MAX}
              </span>
            </span>
            <input
              id={nameId}
              className={INPUT_BASE_CLASS}
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={NAME_MAX}
              disabled={formLocked}
              placeholder="e.g. Northwind Bakery"
              autoComplete="off"
            />
            <span className="project-form-hint">
              Shown in the builder toolbar and exported site title.
            </span>
          </label>

          <label className="project-form-field" htmlFor={descriptionId}>
            <span className="project-form-field-head">
              <span className={LABEL_CLASS}>Description</span>
              <span className="project-form-count" aria-hidden="true">
                {descriptionLength}/{DESCRIPTION_MAX}
              </span>
            </span>
            <textarea
              id={descriptionId}
              className={`${INPUT_BASE_CLASS} project-form-textarea`}
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              maxLength={DESCRIPTION_MAX}
              disabled={formLocked}
              placeholder={
                willUseAi
                  ? 'A warm neighborhood bakery with online ordering and a simple menu…'
                  : 'Optional notes about this project'
              }
            />
            <span className="project-form-hint">
              {willUseAi
                ? 'A short brief helps the AI choose sections and tone.'
                : 'Optional — for your dashboard reference.'}
            </span>
          </label>

          <fieldset className="project-form-status" disabled={formLocked}>
            <legend className={LABEL_CLASS}>Status</legend>
            <div className="project-form-status-toggle" role="group" aria-label="Project status">
              <button
                type="button"
                className={
                  form.status === 'draft'
                    ? 'project-form-status-btn is-active'
                    : 'project-form-status-btn'
                }
                onClick={() => setStatus('draft')}
                aria-pressed={form.status === 'draft'}
              >
                Draft
              </button>
              <button
                type="button"
                className={
                  form.status === 'published'
                    ? 'project-form-status-btn is-active'
                    : 'project-form-status-btn'
                }
                onClick={() => setStatus('published')}
                aria-pressed={form.status === 'published'}
              >
                Published
              </button>
            </div>
            <p className="project-form-hint">
              Draft keeps the project private on your dashboard until you publish.
            </p>
          </fieldset>

          <div className="project-form-actions">
            <Link
              to="/dashboard"
              className="project-form-cancel"
              aria-disabled={formLocked ? 'true' : undefined}
              onClick={(event) => {
                if (formLocked) {
                  event.preventDefault();
                }
              }}
            >
              Cancel
            </Link>
            <Button
              type="submit"
              className="project-form-submit"
              disabled={formLocked}
              aria-busy={isGenerating || submitting}
            >
              {willUseAi && !formLocked ? (
                <SparkleIcon className="w-4 h-4" />
              ) : null}
              {submitLabel}
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
