import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import BuilderStateMessage from '../components/builder/BuilderStateMessage.jsx';
import PreviewViewport from '../components/builder/PreviewViewport.jsx';
import { getProject } from '../services/projectService.js';
import {
  createDefaultWebsiteData,
  normalizeWebsiteData,
} from '../website/schema.js';

export default function PreviewPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await getProject(id);
        if (!cancelled) {
          setProject(response.data.project);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Could not load preview.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <BuilderStateMessage variant="loading" title="Loading preview">
        <p>Fetching saved website data…</p>
      </BuilderStateMessage>
    );
  }

  if (error || !project) {
    return (
      <BuilderStateMessage
        variant="error"
        title="Preview unavailable"
        action={
          <Link className="primary-button" to="/dashboard">
            Back to dashboard
          </Link>
        }
      >
        <p>{error || 'Project not found.'}</p>
      </BuilderStateMessage>
    );
  }

  const hasComponents =
    Array.isArray(project.websiteData?.components) &&
    project.websiteData.components.length > 0;

  const websiteData = normalizeWebsiteData(
    hasComponents
      ? project.websiteData
      : createDefaultWebsiteData(project.name),
  );

  return (
    <section className="preview-page form-page">
      <div className="page-header">
        <div>
          <p className="page-kicker">Preview</p>
          <h1>{project.name}</h1>
          <p className="page-subtitle">Full-page preview of your saved website data.</p>
        </div>
        <div className="builder-header-actions">
          <Link className="btn btn-secondary" to={`/projects/${id}/builder`}>
            Back to builder
          </Link>
          <Link className="btn btn-ghost-dark" to="/dashboard">
            Dashboard
          </Link>
        </div>
      </div>

      <div className="preview-page-shell">
        <PreviewViewport websiteData={websiteData} />
      </div>
    </section>
  );
}
