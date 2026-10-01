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

function ValueAccentIcon({ index }) {
  const paths = [
    'M12 3l2.4 4.86L20 9.27l-4 3.9.94 5.5L12 16.9 7.06 18.67 8 13.17l-4-3.9 5.6-1.41L12 3z',
    'M4 7a3 3 0 013-3h10a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7zm5 2v6m6-6v6M9 9h6',
    'M12 4v2m0 12v2M4 12H2m20 0h-2m-2.34-6.34l1.42-1.42M6.34 17.66l-1.42 1.42m0-14.14l1.42 1.42m12.9 12.9l1.42 1.42M8 12a4 4 0 108 0 4 4 0 00-8 0z',
  ];

  return (
    <div
      className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-500/20"
      aria-hidden="true"
    >
      <svg
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={paths[index % paths.length]} />
      </svg>
    </div>
  );
}

export default function AboutPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="about-page min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50/50 py-16 px-6 lg:px-12 max-w-7xl mx-auto">
      <section className="about-hero max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 mb-6 shadow-sm">
          ✨ About WebStructura
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
          We help teams turn structured content into finished websites
        </h1>
        <p className="about-lead text-xl text-gray-600 mt-4 leading-relaxed max-w-3xl">
          WebStructura is a MERN website builder built for clarity: manage
          projects, compose sections, and preview live — with room for local AI
          drafting when you need a head start.
        </p>
      </section>

      <section
        className="about-section mt-16"
        aria-labelledby="about-values-heading"
      >
        <h2
          id="about-values-heading"
          className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight"
        >
          What we value
        </h2>
        <p className="text-gray-600 mt-2 mb-8 max-w-2xl leading-relaxed">
          Principles that shape every product decision we ship.
        </p>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 list-none m-0 p-0">
          {VALUES.map((value, index) => (
            <li
              key={value.title}
              className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:border-emerald-100 transition-all duration-300"
            >
              <ValueAccentIcon index={index} />
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors">
                {value.title}
              </h3>
              <p className="m-0 text-gray-600 leading-relaxed">{value.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="about-cta relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-950 to-gray-900 text-white p-8 md:p-12 shadow-2xl mt-16 max-w-5xl">
        <div
          className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-28 -left-10 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative z-10">
          <h2 className="text-2xl text-white md:text-3xl font-bold m-0 tracking-tight">
            Ready to build your next site?
          </h2>
          <p className="text-emerald-100 mt-3 mb-8 max-w-xl leading-relaxed">
            Create a workspace, start a project, and preview a polished layout in
            minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {isAuthenticated ? (
              <Link
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-emerald-950 shadow-lg hover:shadow-emerald-500/25 hover:bg-emerald-50 transition-all duration-200"
                to="/dashboard"
              >
                Open dashboard
              </Link>
            ) : (
              <>
                <Link
                  className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-emerald-950 shadow-lg hover:shadow-emerald-500/25 hover:bg-emerald-50 transition-all duration-200"
                  to="/register"
                >
                  Start building
                </Link>
                <Link
                  className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-emerald-500/25 hover:bg-white/10 transition-all duration-200"
                  to="/contact"
                >
                  Contact us
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
