import { Link } from 'react-router-dom';
import SystemStatus from '../components/SystemStatus.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing bg-brand-canvas">
      <section className="landing-hero pt-8 pb-12 lg:pt-12 lg:pb-16">
        <div className="landing-hero-copy">
          <p className="brand-lockup animate-fade-up text-5xl md:text-7xl font-bold tracking-tight">
            WebStructura
          </p>
          <h1 className="animate-fade-up animate-delay-1 tracking-normal text-white">
            Build polished websites from structured content
          </h1>
          <p className="landing-lead animate-fade-up animate-delay-2 leading-relaxed">
            A MERN website builder with live preview, project management, and
            room for local AI drafting later.
          </p>
          <div className="landing-cta animate-fade-up animate-delay-3">
            {isAuthenticated ? (
              <Link className="btn btn-primary shadow-soft" to="/dashboard">
                Open dashboard
              </Link>
            ) : (
              <>
                <Link className="btn btn-primary shadow-soft" to="/register">
                  Start building
                </Link>
                <Link className="btn btn-ghost" to="/login">
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="landing-hero-visual animate-float" aria-hidden="true">
          <div className="hero-browser shadow-soft">
            <div className="hero-browser-bar">
              <span />
              <span />
              <span />
            </div>
            <div className="hero-browser-body">
              <div className="hero-site-nav">Northside Studio</div>
              <div className="hero-site-title">Design that feels finished</div>
              <div className="hero-site-lines">
                <i />
                <i />
                <i />
              </div>
              <div className="hero-site-blocks">
                <div />
                <div />
                <div />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section how-it-works pt-10 pb-12 lg:pt-12 lg:pb-16">
        <h2 className="tracking-normal text-3xl md:text-4xl font-extrabold text-brand-text">
          How it works
        </h2>
        <p className="text-lg text-gray-600 mt-2 mb-6 leading-relaxed">
          Three clear steps from account to a live preview of your site.
        </p>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 list-none m-0 p-0">
          <li className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100 shadow-soft hover:shadow-md transition-shadow duration-300">
            <span className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 font-bold text-base mb-4">
              01
            </span>
            <strong className="block text-lg md:text-xl font-bold text-brand-text mb-2 tracking-normal">
              Create a project
            </strong>
            <p className="m-0 text-gray-600 leading-relaxed">
              Name your site and keep drafts organized in one dashboard.
            </p>
          </li>
          <li className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100 shadow-soft hover:shadow-md transition-shadow duration-300">
            <span className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 font-bold text-base mb-4">
              02
            </span>
            <strong className="block text-lg md:text-xl font-bold text-brand-text mb-2 tracking-normal">
              Compose sections
            </strong>
            <p className="m-0 text-gray-600 leading-relaxed">
              Add Hero, About, Services, and more — all driven by safe JSON
              data.
            </p>
          </li>
          <li className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100 shadow-soft hover:shadow-md transition-shadow duration-300">
            <span className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 font-bold text-base mb-4">
              03
            </span>
            <strong className="block text-lg md:text-xl font-bold text-brand-text mb-2 tracking-normal">
              Preview live
            </strong>
            <p className="m-0 text-gray-600 leading-relaxed">
              Watch desktop, tablet, and mobile frames update as you edit.
            </p>
          </li>
        </ol>
      </section>

      <section className="landing-section landing-section--status pt-10 pb-12 lg:pt-12 lg:pb-16">
        <h2 className="tracking-normal">System status</h2>
        <p className="section-lead leading-relaxed">
          Backend health for local development.
        </p>

        <div className="ui-card status-card shadow-soft">
          <div className="ui-card-header">
            <div>
              <h3 className="ui-card-title tracking-normal">Infrastructure</h3>
              <p className="ui-card-description leading-relaxed">
                Live checks against the local API.
              </p>
            </div>
          </div>

          <div className="ui-card-body">
            <SystemStatus />
          </div>
        </div>
      </section>
    </div>
  );
}
