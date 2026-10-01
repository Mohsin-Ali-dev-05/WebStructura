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
      <div className="public-view public-view--state min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center gap-4">
          <div
            className="w-8 h-8 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"
            aria-hidden="true"
          />
          <p className="text-sm font-medium text-gray-500 tracking-wide animate-pulse m-0">
            Loading site…
          </p>
        </div>
      </div>
    );
  }

  if (error || !websiteData) {
    return (
      <div className="public-view public-view--state min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4">
        <div className="bg-white max-w-md w-full p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100 text-center">
          <div
            className="mx-auto w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-5 text-xl font-bold"
            aria-hidden="true"
          >
            !
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight m-0">
            Site unavailable
          </h1>
          <p className="text-gray-500 leading-relaxed m-0">
            {error || 'Project not found.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="public-view min-h-screen w-full relative bg-white"
      data-public-site="true"
    >
      <WebsiteRenderer websiteData={websiteData} />
      <a
        href="/"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 bg-white/90 backdrop-blur-md shadow-lg shadow-gray-200/50 border border-gray-200/80 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-600 hover:text-gray-900 hover:shadow-xl hover:-translate-y-0.5 transition-all z-50 flex items-center gap-1.5 group"
      >
        ✨{' '}
        <span className="opacity-80 group-hover:opacity-100">
          Built with WebStructura
        </span>
      </a>
    </div>
  );
}
