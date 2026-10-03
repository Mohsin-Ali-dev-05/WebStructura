import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { deleteProject, listProjects } from '../services/projectService.js';
import { formatDate } from '../utils/formatDate.js';
import { getApiErrorMessage } from '../utils/formValidation.js';

function PlusIcon({ className = 'w-4 h-4' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState('');
  const [projectToDelete, setProjectToDelete] = useState(null);

  const isDeleting = Boolean(deletingId);

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      try {
        const response = await listProjects();
        if (!cancelled) {
          setProjects(
            Array.isArray(response.data?.projects)
              ? response.data.projects
              : [],
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(getApiErrorMessage(err, 'Could not load projects.'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  async function confirmDelete() {
    if (!projectToDelete || isDeleting) {
      return;
    }

    const target = projectToDelete;
    const previousProjects = projects;
    setDeletingId(target.id);
    setError('');

    setProjects((current) => current.filter((item) => item.id !== target.id));
    setProjectToDelete(null);

    try {
      await deleteProject(target.id);
      toast.success('Project deleted successfully.', { duration: 3000 });
    } catch (err) {
      setProjects(previousProjects);
      const message = getApiErrorMessage(
        err,
        'Unable to complete action. Please try again.',
      );
      setError(message);
      toast.error(message, {
        duration: 3000,
      });
    } finally {
      setDeletingId('');
    }
  }

  return (
    <section className="dashboard-page">
      <div className="page-header flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-normal">
            Your projects
          </h1>
          <p className="page-subtitle text-gray-600 mt-2">
            Welcome back, {user?.name}. Open the builder to edit, or preview a
            finished layout.
          </p>
        </div>
        <div className="page-header-actions flex flex-wrap items-center gap-3 shrink-0">
          <Link
            className="inline-flex items-center bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-lg font-medium transition-colors border border-transparent"
            to="/templates"
          >
            Template Gallery
          </Link>
          <Link
            className="inline-flex items-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2 rounded-lg font-medium transition-colors border border-transparent"
            to="/projects/new"
          >
            <PlusIcon className="w-4 h-4" />
            New project
          </Link>
        </div>
      </div>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {loading && <p className="page-message">Loading projects…</p>}

      {!loading && (!projects || projects.length === 0) && (
        <div className="dashboard-empty-stack flex flex-col items-center justify-center gap-6 mt-4 mb-8">
          <img
            src="/images/hero-dashboard.jpg"
            alt="WebStructura AI Workspace"
            className="dashboard-workspace-visual w-full max-w-2xl mx-auto h-auto object-contain rounded-2xl shadow-sm border border-gray-100"
          />

          <div
            className="dashboard-empty-state border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center max-w-md w-full bg-white"
            aria-live="polite"
          >
            <h2 className="empty-panel-title text-xl font-bold text-gray-900 m-0">
              No projects yet
            </h2>
            <p className="empty-panel-description text-gray-500 mt-2 mb-5 leading-relaxed">
              Generate your first website with AI, or start from a polished
              template — projects are saved to your account automatically.
            </p>

            <div className="empty-panel-actions flex flex-wrap items-center justify-center gap-3">
              <Link
                className="inline-flex items-center justify-center bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-lg font-medium transition-colors border border-transparent"
                to="/templates"
              >
                Browse templates
              </Link>
              <Link
                className="inline-flex items-center justify-center bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2 rounded-lg font-medium transition-colors border border-transparent"
                to="/projects/new"
              >
                Create blank project
              </Link>
            </div>
          </div>
        </div>
      )}

      {!loading && projects.length > 0 && (
        <ul className="project-list flex flex-col gap-4 list-none m-0 p-0">
          {projects.map((project) => (
            <li
              key={project.id}
              className="project-item bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-4 md:p-6 flex flex-col lg:flex-row justify-between gap-4 lg:gap-6 min-w-0"
            >
              <div className="project-item-main max-w-3xl min-w-0">
                <div className="project-item-top flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-bold text-gray-900 m-0">
                    {project.name}
                  </h2>
                  <span className={`status-badge status-${project.status}`}>
                    {project.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                  {project.templateType ? (
                    <span className="text-xs font-medium text-gray-500 bg-gray-50 border border-gray-100 rounded-md px-2 py-0.5">
                      {project.templateType}
                    </span>
                  ) : null}
                </div>
                {project.description ? (
                  <p className="text-gray-500 text-sm line-clamp-2 mt-2 m-0">
                    {project.description}
                  </p>
                ) : (
                  <p className="text-gray-400 text-sm mt-2 m-0">No description</p>
                )}
                <p className="project-meta text-xs text-gray-400 mt-3 m-0">
                  Updated {formatDate(project.updatedAt)}
                </p>
              </div>

              <div className="project-actions flex flex-wrap items-center gap-2 shrink-0">
                <Link
                  className="inline-flex items-center bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2 rounded-lg font-medium transition-colors border border-transparent"
                  to={`/projects/${project.id}/builder`}
                >
                  Open Builder
                </Link>
                <div className="flex items-center gap-2">
                  <Link
                    className="inline-flex items-center bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-lg font-medium transition-colors border border-transparent"
                    to={`/projects/${project.id}/preview`}
                  >
                    Preview
                  </Link>
                  <Link
                    className="inline-flex items-center bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-lg font-medium transition-colors border border-transparent"
                    to={`/projects/${project.id}/edit`}
                  >
                    Settings
                  </Link>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center bg-rose-50 text-rose-700 hover:bg-rose-100 px-4 py-2 rounded-lg font-medium transition-colors border border-transparent ml-1"
                  onClick={() => setProjectToDelete(project)}
                  disabled={isDeleting}
                  aria-label={`Delete ${project.name}`}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={Boolean(projectToDelete)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setProjectToDelete(null);
          }
        }}
        title="Delete project"
        description={
          projectToDelete
            ? `Are you sure you want to delete ${projectToDelete.name}? This cannot be undone.`
            : ''
        }
        confirmText="Delete"
        cancelText="Cancel"
        destructive
        loading={isDeleting}
        onConfirm={confirmDelete}
      />
    </section>
  );
}
