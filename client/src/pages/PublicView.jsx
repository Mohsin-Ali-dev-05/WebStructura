import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicProject } from '../services/projectService.js';
import WebsiteRenderer from '../website/WebsiteRenderer.jsx';
import { normalizeWebsiteData } from '../website/schema.js';

/**
 * Public share page — full-viewport standalone site.
 * No builder chrome, AI panel, editor, or app navigation.
 */
export default function PublicView() {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [websiteData, setWebsiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');

      try {
        const response = await getPublicProject(id);
        if (cancelled) {
          return;
        }

        const project = response.data?.project;
        if (!project?.websiteData) {
          throw new Error('This shared site has no content yet.');
        }

        setName(project.name || 'Website');
        setWebsiteData(normalizeWebsiteData(project.websiteData));
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'This shared site could not be loaded.');
          setWebsiteData(null);
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

  useEffect(() => {
    if (name) {
      document.title = name;
    }

    return () => {
      document.title = 'WebStructura';
    };
  }, [name]);

  if (loading) {
    return (
      <div className="public-view public-view--state">
        <p className="public-view-message">Loading site…</p>
      </div>
    );
  }

  if (error || !websiteData) {
    return (
      <div className="public-view public-view--state">
        <h1 className="public-view-error-title">Site unavailable</h1>
        <p className="public-view-message">{error || 'Project not found.'}</p>
      </div>
    );
  }

  return (
    <div className="public-view" data-public-site="true">
      <WebsiteRenderer websiteData={websiteData} />
    </div>
  );
}
