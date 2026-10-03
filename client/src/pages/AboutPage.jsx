import { Link } from 'react-router-dom';
import AuthLink from '../components/AuthLink.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const AUDIENCES = [
  {
    title: 'Founders and small teams',
    body: 'Ship a polished marketing site without waiting on a full design sprint or wrestling with a blank Figma file.',
  },
  {
    title: 'Freelancers and agencies',
    body: 'Start from a solid layout, customize copy and sections with clients, then export real React instead of a locked template.',
  },
  {
    title: 'Developers who want speed',
    body: 'Keep structure in JSON, preview across devices, and leave with code you can actually maintain.',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Start from a template or a blank canvas',
    body: 'Pick an industry layout or begin empty. Name the project, set a short description, and open the builder.',
  },
  {
    num: '02',
    title: 'Compose sections and preview live',
    body: 'Add Navbar, Hero, About, Pricing, and the rest. Edit props in place and check desktop, tablet, and mobile as you go.',
  },
  {
    num: '03',
    title: 'Draft with local AI when you need a head start',
    body: 'Optional Ollama assistance stays on your machine. Use it for first-pass copy or structure, then refine by hand.',
  },
  {
    num: '04',
    title: 'Export React you can deploy',
    body: 'Download a clean project bundle ready for Vercel, Netlify, or your own host — not a proprietary page dump.',
  },
];

const PRINCIPLES = [
  {
    title: 'Readable structure',
    body: 'Sites are composed from clear sections and props, so teammates can edit without reverse-engineering the layout.',
  },
  {
    title: 'Honest defaults',
    body: 'Templates and design tokens are meant to look finished first, then get customized — not the other way around.',
  },
  {
    title: 'Local-first assistance',
    body: 'When AI helps, it should respect privacy. Drafts can run locally so prompts and project content stay with you.',
  },
];

export default function AboutPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="about-page">
      <section className="about-hero" aria-labelledby="about-heading">
        <p className="about-kicker">About</p>
        <h1 id="about-heading" className="about-brand">
          WebStructura
        </h1>
        <p className="about-tagline">
          A practical website builder for people who need a real site — not another
          demo that falls apart after export.
        </p>
        <p className="about-lead">
          We built WebStructura so founders, freelancers, and small teams can go from
          idea to editable React pages without fighting boilerplate, opaque builders,
          or cloud AI lock-in. Create a project, compose sections, preview live, and
          leave with code you own.
        </p>
        <figure className="about-hero-media">
          <img
            src="/images/hero-dashboard.jpg"
            alt="WebStructura workspace showing projects and a live site preview"
            width={1600}
            height={900}
            loading="eager"
            decoding="async"
          />
          <figcaption>
            Project workspace and live preview — the same flow you use after signup.
          </figcaption>
        </figure>
      </section>

      <section className="about-section" aria-labelledby="about-story-heading">
        <h2 id="about-story-heading">Why we exist</h2>
        <div className="about-prose">
          <p>
            Most website builders optimize for speed at the cost of control. You get a
            pretty canvas, then hit a wall when you need clean code, offline AI, or a
            layout that still makes sense six months later.
          </p>
          <p>
            WebStructura takes the opposite path. Your site is structured content —
            sections with clear props — rendered by responsive React components. That
            means the editor stays understandable, previews stay honest, and exports
            stay usable.
          </p>
          <p>
            We are not trying to replace professional design systems for every company
            on earth. We are trying to make the first serious version of a site faster
            to ship, easier to edit, and safer to own.
          </p>
        </div>
      </section>

      <section className="about-section" aria-labelledby="about-audience-heading">
        <h2 id="about-audience-heading">Who it is for</h2>
        <p className="about-section-lead">
          If you need a credible web presence and prefer software that stays
          inspectable, you are in the right place.
        </p>
        <ul className="about-audience-list">
          {AUDIENCES.map((item) => (
            <li key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="about-section" aria-labelledby="about-steps-heading">
        <h2 id="about-steps-heading">How a project actually moves</h2>
        <p className="about-section-lead">
          No mystery workflow — four steps from empty workspace to deployable React.
        </p>
        <ol className="about-steps">
          {STEPS.map((step) => (
            <li key={step.num}>
              <span className="about-step-num" aria-hidden="true">
                {step.num}
              </span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="about-section" aria-labelledby="about-principles-heading">
        <h2 id="about-principles-heading">What we care about</h2>
        <p className="about-section-lead">
          Product decisions follow a few simple rules. If something fights them, we
          usually leave it out.
        </p>
        <ul className="about-principles">
          {PRINCIPLES.map((item) => (
            <li key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="about-cta" aria-labelledby="about-cta-heading">
        <div
          className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-28 -left-10 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative z-10">
          <h2 id="about-cta-heading" className="text-2xl text-white md:text-3xl font-bold m-0 tracking-tight">
            Ready to start a real project?
          </h2>
          <p className="text-emerald-100 mt-3 mb-8 max-w-xl leading-relaxed">
            Open a workspace, choose a template or blank canvas, and preview a
            finished layout the same day.
          </p>
          <div className="about-cta-actions">
            {isAuthenticated ? (
              <AuthLink
                className="about-cta-primary"
                to="/dashboard"
              >
                Open dashboard
              </AuthLink>
            ) : (
              <>
                <Link className="about-cta-primary" to="/register">
                  Create free account
                </Link>
                <Link className="about-cta-secondary" to="/contact">
                  Talk to us
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
