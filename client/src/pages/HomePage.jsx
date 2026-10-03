import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SystemStatus from '../components/SystemStatus.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const TECH_STACK = [
  { name: 'React', mark: '⚛' },
  { name: 'Node.js', mark: '⬢' },
  { name: 'MongoDB', mark: '🍃' },
  { name: 'Tailwind CSS', mark: 'TW' },
  { name: 'Ollama', mark: '🦙' },
];

const FEATURES = [
  {
    id: 'local-ai',
    large: true,
    title: '100% Local AI. Zero Privacy Leaks.',
    body: 'Powered by Ollama, your prompts and data never leave your machine. Build with the power of LLMs without the privacy concerns of cloud APIs.',
  },
  {
    id: 'components',
    title: 'Component-Driven',
    body: 'Every block is mapped to strict, responsive Tailwind CSS components. No broken layouts, ever.',
  },
  {
    id: 'export',
    title: 'Export Real Code',
    body: "Don't get locked in. Download your entire project as a clean, structured React repository.",
  },
  {
    id: 'json',
    title: 'JSON Architecture',
    body: 'Under the hood, your site is just a highly structured JSON object, making it endlessly extensible.',
  },
];

const STEPS = [
  {
    step: '01',
    title: 'Describe your vision',
    body: 'Type a simple prompt or select a starting template. The local AI engine instantly maps your requirements to our library of optimized UI components.',
    image: '/images/create-project.jpg',
    alt: 'Create a project by describing your vision',
    imageFirst: true,
  },
  {
    step: '02',
    title: 'Tweak and refine',
    body: 'Use our intuitive visual editor to swap colors, edit copy, and adjust layouts. See your changes instantly in a true 1:1 live preview across desktop, tablet, and mobile.',
    image: '/images/hero-dashboard.jpg',
    alt: 'Visual editor with live multi-device preview',
    imageFirst: false,
  },
  {
    step: '03',
    title: 'Export and deploy',
    body: 'When you\'re happy, click export. WebStructura bundles your project into a standard React app ready to be pushed to Vercel, Netlify, or your own servers.',
    image: '/images/template-gallery.jpg',
    alt: 'Export-ready React project from templates',
    imageFirst: true,
  },
];

const TESTIMONIALS = [
  {
    quote:
      'It cut our prototyping time from 3 days to 30 minutes. The fact that I get clean React code at the end is a game-changer.',
    name: 'Sarah J.',
    role: 'Frontend Lead',
  },
  {
    quote:
      "Finally, an AI builder that doesn't hallucinate broken CSS. The strict component mapping keeps everything looking professional.",
    name: 'Mark T.',
    role: 'Product Designer',
  },
  {
    quote:
      'Running the AI locally with Ollama means I can build on airplanes without WiFi. It\'s incredibly fast.',
    name: 'Elena R.',
    role: 'Indie Hacker',
  },
];

const FAQS = [
  {
    q: 'Is the exported code actually usable?',
    a: 'Yes. Unlike other builders that export messy spaghetti code, WebStructura exports clean, modular React components styled with standard Tailwind CSS.',
  },
  {
    q: 'Do I need a powerful GPU to run this?',
    a: 'While a good GPU helps Ollama generate layouts faster, WebStructura is optimized to run efficiently on standard Apple Silicon (M1/M2) and modern Intel processors.',
  },
  {
    q: 'Can I import my own components?',
    a: 'Currently, the system uses our curated library of premium components to guarantee responsive layouts, but custom component ingestion is on the roadmap.',
  },
];

function StepMedia({ image, alt }) {
  return (
    <div className="how-zigzag-media relative">
      <div
        className="absolute -inset-4 bg-gradient-to-tr from-emerald-100 to-teal-50 blur-2xl -z-10 rounded-full opacity-50"
        aria-hidden="true"
      />
      <img
        src={image}
        alt={alt}
        className="relative z-10 w-full rounded-xl shadow-xl border border-gray-100 transform hover:-translate-y-1 transition-transform duration-300"
      />
    </div>
  );
}

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      return undefined;
    }

    const id = location.hash.slice(1);
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 50);

    return () => window.clearTimeout(timer);
  }, [location.hash, location.pathname]);

  return (
    <div className="landing landing-saas bg-brand-canvas">
      <section className="landing-hero landing-hero--stacked relative overflow-hidden w-full rounded-b-[3rem] shadow-2xl flex flex-col items-center gap-8 pt-8 pb-10 px-4 md:px-6 lg:pt-12 lg:pb-12 lg:px-8">
        <div className="landing-hero-copy w-full max-w-3xl min-w-0 px-4 md:px-0 box-border text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-6 backdrop-blur-md animate-fade-up">
            ✨ WebStructura 1.0 is Live
          </div>
          <h1 className="animate-fade-up animate-delay-1 tracking-tight text-3xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
            Design at the speed of thought.
          </h1>
          <p className="landing-lead animate-fade-up animate-delay-2 leading-relaxed mx-auto text-base md:text-lg text-gray-300">
            Stop wrestling with boilerplate. WebStructura uses local AI to
            generate, customize, and export production-ready React websites in
            seconds. All running securely on your machine.
          </p>
          <div className="landing-cta animate-fade-up animate-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link className="btn btn-primary shadow-soft" to="/dashboard">
                Open dashboard
              </Link>
            ) : (
              <Link className="btn btn-primary shadow-soft" to="/register">
                Start Building Free
              </Link>
            )}
            <Link className="btn btn-ghost landing-hero-ghost" to="/about">
              View Documentation
            </Link>
          </div>
        </div>

        <div className="landing-hero-visual w-full max-w-5xl min-w-0 px-2 md:px-0 box-border">
          <img
            src="/images/hero-dashboard.jpg"
            alt="WebStructura dashboard preview"
            className="w-full max-w-5xl mx-auto rounded-2xl shadow-2xl border border-white/10 object-cover"
          />
        </div>
      </section>

      <section
        className="landing-logo-cloud py-10 px-4 md:px-6"
        aria-label="Technology stack"
      >
        <p className="text-center text-xs font-semibold tracking-widest uppercase text-gray-500 mb-6">
          Powered by open-source technology
        </p>
        <ul className="logo-cloud-list flex flex-wrap items-center justify-center gap-x-8 gap-y-4 list-none m-0 p-0 max-w-4xl mx-auto">
          {TECH_STACK.map((tech) => (
            <li
              key={tech.name}
              className="logo-cloud-item flex items-center gap-2 text-gray-600"
            >
              <span
                className="logo-cloud-mark inline-flex items-center justify-center w-8 h-8 rounded-md bg-white border border-gray-200 text-sm font-bold text-emerald-700"
                aria-hidden="true"
              >
                {tech.mark}
              </span>
              <span className="text-sm font-medium tracking-tight">
                {tech.name}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="features"
        className="landing-section landing-bento pt-8 pb-10 lg:pt-12 lg:pb-16"
      >
        <h2 className="tracking-tight text-3xl md:text-4xl font-extrabold text-brand-text mb-2">
          Built for serious builders
        </h2>
        <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl mb-10 mt-0">
          Local intelligence, strict components, and exportable React — without
          the cloud lock-in.
        </p>

        <div className="bento-grid grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {FEATURES.map((feature) => (
            <article
              key={feature.id}
              className={`bento-card bg-white/80 backdrop-blur-md border border-gray-100 rounded-3xl p-8 shadow-xl shadow-gray-100/50 hover:-translate-y-1 hover:shadow-2xl hover:border-emerald-200/60 transition-all duration-300 group ${
                feature.large ? 'bento-card--large md:col-span-2' : ''
              }`}
            >
              <h3 className="tracking-tight text-xl md:text-2xl font-bold text-brand-text m-0 mb-3 group-hover:text-emerald-800 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed m-0 text-base">
                {feature.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="how-it-works"
        className="landing-section how-it-works how-it-works--zigzag pt-8 pb-10 lg:pt-10 lg:pb-16"
      >
        <h2 className="tracking-tight text-3xl md:text-4xl font-extrabold text-brand-text">
          How it works
        </h2>
        <p className="text-lg text-gray-600 mt-2 mb-10 leading-relaxed max-w-2xl">
          Three steps from prompt to production-ready React.
        </p>

        <div className="how-zigzag flex flex-col gap-12 md:gap-16">
          {STEPS.map((item) => (
            <div
              key={item.step}
              className="how-zigzag-row grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
            >
              {item.imageFirst ? (
                <StepMedia image={item.image} alt={item.alt} />
              ) : null}
              <div
                className={`how-zigzag-copy ${
                  item.imageFirst ? '' : 'md:order-1'
                }`}
              >
                <p className="how-zigzag-eyebrow text-sm font-semibold uppercase tracking-wide text-emerald-600 mb-2">
                  {item.step}
                </p>
                <h3 className="text-2xl md:text-3xl font-bold text-brand-text tracking-tight mb-3">
                  {item.title}
                </h3>
                <p className="m-0 text-gray-600 leading-relaxed text-base md:text-lg">
                  {item.body}
                </p>
              </div>
              {!item.imageFirst ? (
                <div className="md:order-2">
                  <StepMedia image={item.image} alt={item.alt} />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section landing-testimonials pt-8 pb-10 lg:pt-12 lg:pb-16">
        <h2 className="tracking-tight text-3xl md:text-4xl font-extrabold text-brand-text text-center mb-10">
          Built for developers and designers.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {TESTIMONIALS.map((item) => (
            <blockquote
              key={item.name}
              className="testimonial-card bg-gray-50 border border-gray-100 rounded-3xl p-8 hover:bg-white transition-colors duration-300 m-0 flex flex-col gap-4"
            >
              <div
                className="text-5xl text-gray-200 font-serif leading-none h-6"
                aria-hidden="true"
              >
                &ldquo;
              </div>
              <p className="text-gray-600 leading-relaxed m-0 text-base">
                {item.quote}
              </p>
              <footer className="mt-auto pt-2 border-t border-gray-100">
                <cite className="not-italic text-sm font-semibold tracking-tight text-brand-text">
                  {item.name}
                </cite>
                <p className="text-xs text-gray-500 m-0 mt-0.5">{item.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section
        id="faq"
        className="landing-section landing-faq pt-8 pb-10 lg:pt-12 lg:pb-16"
      >
        <h2 className="tracking-tight text-3xl md:text-4xl font-extrabold text-brand-text mb-8">
          Frequently asked questions
        </h2>
        <div className="faq-list flex flex-col gap-4 max-w-3xl">
          {FAQS.map((item) => (
            <details
              key={item.q}
              className="faq-item bg-white border border-gray-100 rounded-xl p-5 shadow-soft group"
            >
              <summary className="faq-summary cursor-pointer list-none font-semibold tracking-tight text-brand-text text-base md:text-lg">
                {item.q}
              </summary>
              <p className="text-gray-600 leading-relaxed mt-3 mb-0 text-base">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="landing-section landing-section--status pt-8 pb-10 lg:pt-10 lg:pb-12">
        <h2 className="font-mono text-emerald-400 text-sm tracking-widest uppercase text-center">
          System status
        </h2>
        <p className="section-lead text-gray-500 leading-relaxed text-center text-sm mt-2">
          Backend health for local development.
        </p>

        <div className="status-card bg-gray-950 border border-gray-800 rounded-2xl p-6 text-gray-300 shadow-2xl max-w-3xl mx-auto mt-8">
          <div className="ui-card-header mb-4">
            <div>
              <h3 className="font-mono text-emerald-400 text-sm tracking-widest uppercase m-0">
                Infrastructure
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mt-2 mb-0">
                Live checks against the local API.
              </p>
            </div>
          </div>

          <div className="ui-card-body status-card-body--terminal">
            <SystemStatus />
          </div>
        </div>
      </section>
    </div>
  );
}
