import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
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

const fieldClassName =
  'w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all';

export default function ProjectFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedTemplate = !isEdit ? location.state?.template || null : null;
  const willUseAi = !isEdit && !selectedTemplate;

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const formLocked = submitting || isGenerating;

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

    // Create project — AI path when no template is selected
    const createPayload = selectedTemplate?.websiteData
      ? {
          ...payload,
          websiteData: resolveWebsiteData(payload.name),
        }
      : payload;

    let loadingToastId;

    if (willUseAi) {
      setIsGenerating(true);
      loadingToastId = toast.loading(
        '✨ AI is building your website… This can take about 20 seconds.',
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

      // Open the builder so the user can see what was generated
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
    return <p className="page-message">Loading project…</p>;
  }

  let submitLabel = 'Create project';
  if (isEdit) {
    submitLabel = submitting ? 'Saving…' : 'Save changes';
  } else if (isGenerating) {
    submitLabel = '✨ AI is building your website...';
  } else if (submitting) {
    submitLabel = 'Creating…';
  }

  return (
    <main className="form-page flex-1 flex flex-col items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl">
        {!isEdit && selectedTemplate ? (
          <div className="template-selected-banner mb-4">
            <div>
              <p className="template-selected-label">Selected template</p>
              <strong>{selectedTemplate.title}</strong>
            </div>
            <Link className="text-link" to="/templates">
              Change template
            </Link>
          </div>
        ) : null}

        <form
          className="bg-white rounded-xl border border-gray-200 shadow-lg p-8 space-y-4"
          onSubmit={handleSubmit}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {isEdit ? 'Edit project' : 'Create a project'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {isEdit
                  ? 'Update the name, description, or status of this website project.'
                  : selectedTemplate
                    ? `Using the “${selectedTemplate.title}” template. Confirm the details below to open the builder.`
                    : 'Describe your site — local AI will draft the first pages (about 20 seconds).'}
              </p>
            </div>
            <Link
              to="/dashboard"
              className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-all"
              aria-label="Close and return to dashboard"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </Link>
          </div>

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          <label className="form-field-label">
            Name
            <input
              className={fieldClassName}
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={100}
              disabled={formLocked}
            />
          </label>

          <label className="form-field-label">
            Description
            <textarea
              className={fieldClassName}
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              maxLength={500}
              disabled={formLocked}
            />
          </label>

          <label className="form-field-label">
            Status
            <select
              className={fieldClassName}
              name="status"
              value={form.status}
              onChange={handleChange}
              disabled={formLocked}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>

          <button
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-lg transition-colors"
            type="submit"
            disabled={formLocked}
            aria-busy={isGenerating || submitting}
          >
            {submitLabel}
          </button>
        </form>
      </div>
    </main>
  );
}
