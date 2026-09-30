import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const VALUES = [
  {
    title: 'Clarity first',
    body: 'Every project starts with structured content so teams ship sites that stay editable and understandable.',
  },
  {
    title: 'Crafted defaults',
    body: 'Premium layouts and design tokens out of the box — less fiddling, more shipping polished pages.',
  },
  {
    title: 'Builder freedom',
    body: 'Compose sections, preview live, and iterate without fighting a rigid page builder.',
  },
];

export default function AboutPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="about-page">
      <section className="about-hero pt-12 pb-16 lg:pt-16 lg:pb-24">
        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-text tracking-normal">
          We help teams turn structured content into finished websites
        </h1>
        <p className="about-lead text-lg text-gray-600 mt-4 leading-relaxed">
          WebStructura is a MERN website builder built for clarity: manage
          projects, compose sections, and preview live — with room for local AI
          drafting when you need a head start.
        </p>
      </section>

      <section
        className="about-section pt-12 pb-16 lg:pt-16 lg:pb-24"
        aria-labelledby="about-values-heading"
      >
        <h2
          id="about-values-heading"
          className="text-2xl font-bold text-brand-text tracking-normal"
        >
          What we value
        </h2>
        <p className="text-gray-600 mt-2 mb-8 max-w-2xl leading-relaxed">
          Principles that shape every product decision we ship.
        </p>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 list-none m-0 p-0">
          {VALUES.map((value) => (
            <li
              key={value.title}
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-soft"
            >
              <h3 className="text-xl font-bold text-brand-text mb-3 tracking-normal">
                {value.title}
              </h3>
              <p className="m-0 text-gray-600 leading-relaxed">{value.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="about-cta rounded-2xl bg-emerald-900 text-white p-10 md:p-14 shadow-soft">
        <h2 className="text-2xl text-white md:text-3xl font-bold m-0 tracking-normal">
          Ready to build your next site?
        </h2>
        <p className="text-emerald-100 mt-3 mb-8 max-w-xl leading-relaxed">
          Create a workspace, start a project, and preview a polished layout in
          minutes.
        </p>
        <div className="flex flex-wrap gap-3">
          {isAuthenticated ? (
            <Link className="btn btn-primary about-cta-primary" to="/dashboard">
              Open dashboard
            </Link>
          ) : (
            <>
              <Link className="btn btn-primary about-cta-primary" to="/register">
                Start building
              </Link>
              <Link className="btn btn-ghost about-cta-ghost" to="/contact">
                Contact us
              </Link>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
