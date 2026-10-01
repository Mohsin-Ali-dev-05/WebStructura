import JSZip from 'jszip';

/**
 * Strip editor-only fields from websiteData for a clean export.
 */
function sanitizeWebsiteData(websiteData = {}) {
  const theme =
    websiteData.theme && typeof websiteData.theme === 'object'
      ? websiteData.theme
      : {};

  const components = Array.isArray(websiteData.components)
    ? websiteData.components
        .filter((block) => block && typeof block.type === 'string')
        .map((block) => {
          const props =
            block.props && typeof block.props === 'object' ? { ...block.props } : {};
          delete props._editorId;
          if (Array.isArray(props.items)) {
            props.items = props.items.map((item) => {
              if (!item || typeof item !== 'object') return item;
              const next = { ...item };
              delete next._editorId;
              return next;
            });
          }
          if (Array.isArray(props.links)) {
            props.links = props.links.map((item) => {
              if (!item || typeof item !== 'object') return item;
              const next = { ...item };
              delete next._editorId;
              return next;
            });
          }
          if (Array.isArray(props.columns)) {
            props.columns = props.columns.map((col) => {
              if (!col || typeof col !== 'object') return col;
              const next = { ...col };
              delete next._editorId;
              if (Array.isArray(next.links)) {
                next.links = next.links.map((link) => {
                  if (!link || typeof link !== 'object') return link;
                  const cleaned = { ...link };
                  delete cleaned._editorId;
                  return cleaned;
                });
              }
              return next;
            });
          }
          return {
            id: block.id || undefined,
            type: block.type,
            props,
          };
        })
    : [];

  return {
    title:
      typeof websiteData.title === 'string' && websiteData.title.trim()
        ? websiteData.title.trim()
        : 'WebStructura Site',
    theme: {
      primaryColor: theme.primaryColor || '#059669',
      backgroundColor: theme.backgroundColor || '#ffffff',
      textColor: theme.textColor || '#0f172a',
      font:
        theme.font ||
        'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    components,
  };
}

function buildPackageJson(projectTitle) {
  const name =
    String(projectTitle || 'webstructura-site')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 50) || 'webstructura-site';

  return `${JSON.stringify(
    {
      name,
      private: true,
      version: '1.0.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview',
      },
      dependencies: {
        react: '^18.3.1',
        'react-dom': '^18.3.1',
        'lucide-react': '^0.468.0',
      },
      devDependencies: {
        '@vitejs/plugin-react': '^4.3.4',
        autoprefixer: '^10.4.20',
        postcss: '^8.4.49',
        tailwindcss: '^3.4.16',
        vite: '^5.4.11',
      },
    },
    null,
    2,
  )}\n`;
}

function buildTailwindConfig() {
  return `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'var(--color-primary)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
`;
}

function buildPostcssConfig() {
  return `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;
}

function buildViteConfig() {
  return `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
`;
}

function buildIndexHtml(title) {
  const safeTitle = String(title || 'WebStructura Site')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeTitle}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`;
}

function buildMainJsx() {
  return `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`;
}

function buildIndexCss(theme) {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-primary: ${theme.primaryColor};
  --color-bg: ${theme.backgroundColor};
  --color-text: ${theme.textColor};
  --font-sans: ${JSON.stringify(theme.font).slice(1, -1)};
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: var(--font-sans);
  color: var(--color-text);
  background: var(--color-bg);
  -webkit-font-smoothing: antialiased;
}
`;
}

/**
 * Generate App.jsx that embeds websiteData and maps each block to JSX sections.
 */
function buildAppJsx(websiteData) {
  const dataLiteral = JSON.stringify(websiteData, null, 2);

  return `import { useMemo } from 'react';

const websiteData = ${dataLiteral};

function Section({ id, className = '', children }) {
  return (
    <section id={id} className={\`w-full px-4 py-12 md:px-8 md:py-16 \${className}\`}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

function PrimaryButton({ href = '#', children }) {
  return (
    <a
      href={href || '#'}
      className="inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] px-8 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
    >
      {children}
    </a>
  );
}

function SecondaryButton({ href = '#', children }) {
  return (
    <a
      href={href || '#'}
      className="inline-flex items-center justify-center rounded-full border border-gray-300 px-8 py-3.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
    >
      {children}
    </a>
  );
}

function NavbarSection({ brand = 'Brand', links = [] }) {
  return (
    <header className="sticky top-0 z-20 border-b border-gray-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <a href="#top" className="text-lg font-bold tracking-tight text-[var(--color-text)]">
          {brand}
        </a>
        <nav className="hidden items-center gap-6 md:flex">
          {(links || []).map((link, index) => (
            <a
              key={\`\${link.label}-\${index}\`}
              href={link.href || '#'}
              className="text-sm font-medium text-gray-600 transition hover:text-[var(--color-primary)]"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function HeroSection(props) {
  const {
    title = 'Welcome',
    subtitle = '',
    ctaLabel = '',
    ctaHref = '#',
    secondaryLabel = '',
    secondaryHref = '#',
    image = '',
    imageAlt = '',
    layout = 'split',
  } = props;
  const reverse = layout === 'split-reverse';

  return (
    <Section id="top" className="bg-white">
      <div
        className={\`flex flex-col items-center gap-10 md:flex-row \${
          reverse ? 'md:flex-row-reverse' : ''
        }\`}
      >
        <div className="w-full text-center md:w-1/2 md:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-text)] md:text-5xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 md:mx-0">
              {subtitle}
            </p>
          ) : null}
          {ctaLabel ? (
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
              <PrimaryButton href={ctaHref}>{ctaLabel}</PrimaryButton>
              {secondaryLabel ? (
                <SecondaryButton href={secondaryHref}>{secondaryLabel}</SecondaryButton>
              ) : null}
            </div>
          ) : null}
        </div>
        {image ? (
          <div className="w-full md:w-1/2">
            <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-lg aspect-[4/3]">
              <img src={image} alt={imageAlt || title} className="h-full w-full object-cover" />
            </div>
          </div>
        ) : null}
      </div>
    </Section>
  );
}

function AboutSection({
  heading = 'About',
  body = '',
  image = '',
  imageAlt = '',
  layout = 'split',
}) {
  const reverse = layout === 'split-reverse';
  return (
    <Section id="about">
      <div
        className={\`flex flex-col items-center gap-10 md:flex-row \${
          reverse ? 'md:flex-row-reverse' : ''
        }\`}
      >
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-bold tracking-tight">{heading}</h2>
          {body ? <p className="mt-4 text-gray-600 leading-relaxed whitespace-pre-line">{body}</p> : null}
        </div>
        {image ? (
          <div className="w-full md:w-1/2">
            <img
              src={image}
              alt={imageAlt || heading}
              className="w-full rounded-2xl border border-gray-100 object-cover shadow-md aspect-[4/3]"
            />
          </div>
        ) : null}
      </div>
    </Section>
  );
}

function SkillsSection({ heading = 'Skills', subheading = '', items = [] }) {
  return (
    <Section id="skills" className="bg-gray-50">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight">{heading}</h2>
        {subheading ? <p className="mt-3 text-gray-600">{subheading}</p> : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(items || []).map((item, index) => (
          <div
            key={\`\${item.name}-\${index}\`}
            className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold tracking-tight">{item.name}</h3>
              {item.level ? (
                <span className="text-sm text-[var(--color-primary)]">{item.level}</span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function ServicesSection({ heading = 'Services', subheading = '', items = [] }) {
  return (
    <Section id="services">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight">{heading}</h2>
        {subheading ? <p className="mt-3 text-gray-600">{subheading}</p> : null}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(items || []).map((item, index) => (
          <article
            key={\`\${item.title}-\${index}\`}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.title || ''}
                className="mb-4 h-40 w-full rounded-xl object-cover"
              />
            ) : null}
            <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
            {item.description ? (
              <p className="mt-2 text-gray-600 leading-relaxed">{item.description}</p>
            ) : null}
          </article>
        ))}
      </div>
    </Section>
  );
}

function ProjectsSection({ heading = 'Projects', subheading = '', items = [] }) {
  return (
    <Section id="projects" className="bg-gray-50">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight">{heading}</h2>
        {subheading ? <p className="mt-3 text-gray-600">{subheading}</p> : null}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {(items || []).map((item, index) => (
          <article
            key={\`\${item.title}-\${index}\`}
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
          >
            {item.image ? (
              <img src={item.image} alt={item.title || ''} className="h-48 w-full object-cover" />
            ) : null}
            <div className="p-6">
              <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
              {item.description ? (
                <p className="mt-2 text-gray-600 leading-relaxed">{item.description}</p>
              ) : null}
              {item.link ? (
                <a
                  href={item.link}
                  className="mt-4 inline-flex text-sm font-semibold text-[var(--color-primary)]"
                >
                  View project →
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

function TestimonialsSection({
  heading = 'Testimonials',
  subheading = '',
  items = [],
}) {
  return (
    <Section id="testimonials">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight">{heading}</h2>
        {subheading ? <p className="mt-3 text-gray-600">{subheading}</p> : null}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {(items || []).map((item, index) => (
          <blockquote
            key={\`\${item.author}-\${index}\`}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <p className="text-gray-600 leading-relaxed">&ldquo;{item.quote}&rdquo;</p>
            <footer className="mt-4">
              <p className="text-sm font-semibold tracking-tight">{item.author}</p>
              {item.role ? <p className="text-xs text-gray-500">{item.role}</p> : null}
            </footer>
          </blockquote>
        ))}
      </div>
    </Section>
  );
}

function PricingSection({
  heading = 'Pricing',
  subheading = '',
  tiers = [],
}) {
  return (
    <Section id="pricing" className="bg-gray-50">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight">{heading}</h2>
        {subheading ? <p className="mt-3 text-gray-600">{subheading}</p> : null}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {(tiers || []).map((tier, index) => (
          <article
            key={\`\${tier.name}-\${index}\`}
            className={\`rounded-2xl border p-6 shadow-sm \${
              tier.highlighted
                ? 'border-[var(--color-primary)] bg-white ring-2 ring-[var(--color-primary)]'
                : 'border-gray-100 bg-white'
            }\`}
          >
            <h3 className="text-xl font-semibold tracking-tight">{tier.name}</h3>
            <p className="mt-3 text-3xl font-extrabold tracking-tight">
              {tier.price}
              {tier.period ? (
                <span className="text-base font-medium text-gray-500">/{tier.period}</span>
              ) : null}
            </p>
            {tier.description ? (
              <p className="mt-2 text-sm text-gray-600">{tier.description}</p>
            ) : null}
            <ul className="mt-6 space-y-2">
              {(tier.features || []).map((feature, featureIndex) => (
                <li key={featureIndex} className="text-sm text-gray-600">
                  ✓ {feature}
                </li>
              ))}
            </ul>
            {tier.ctaLabel ? (
              <div className="mt-8">
                <PrimaryButton href={tier.ctaHref || '#'}>{tier.ctaLabel}</PrimaryButton>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </Section>
  );
}

function FAQSection({ heading = 'FAQ', subheading = '', items = [] }) {
  return (
    <Section id="faq">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight">{heading}</h2>
        {subheading ? <p className="mt-3 text-gray-600">{subheading}</p> : null}
      </div>
      <div className="mx-auto flex max-w-3xl flex-col gap-3">
        {(items || []).map((item, index) => (
          <details
            key={\`\${item.question}-\${index}\`}
            className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <summary className="cursor-pointer font-semibold tracking-tight">
              {item.question}
            </summary>
            {item.answer ? (
              <p className="mt-3 text-gray-600 leading-relaxed">{item.answer}</p>
            ) : null}
          </details>
        ))}
      </div>
    </Section>
  );
}

function GallerySection({ heading = 'Gallery', subheading = '', images = [] }) {
  return (
    <Section id="gallery" className="bg-gray-50">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight">{heading}</h2>
        {subheading ? <p className="mt-3 text-gray-600">{subheading}</p> : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(images || []).map((image, index) => {
          const src = typeof image === 'string' ? image : image?.url;
          const alt = typeof image === 'string' ? '' : image?.alt || '';
          if (!src) return null;
          return (
            <img
              key={\`\${src}-\${index}\`}
              src={src}
              alt={alt}
              className="h-56 w-full rounded-xl object-cover shadow-sm"
            />
          );
        })}
      </div>
    </Section>
  );
}

function CTASection({
  heading = 'Get started',
  body = '',
  ctaLabel = '',
  ctaHref = '#',
  secondaryLabel = '',
  secondaryHref = '#',
}) {
  return (
    <Section id="cta" className="bg-[var(--color-primary)] text-white">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white">{heading}</h2>
        {body ? <p className="mt-4 text-white/90 leading-relaxed">{body}</p> : null}
        {ctaLabel ? (
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={ctaHref || '#'}
              className="inline-flex rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[var(--color-primary)]"
            >
              {ctaLabel}
            </a>
            {secondaryLabel ? (
              <a
                href={secondaryHref || '#'}
                className="inline-flex rounded-full border border-white/40 px-8 py-3.5 text-sm font-medium text-white"
              >
                {secondaryLabel}
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </Section>
  );
}

function ContactSection({
  heading = 'Contact',
  email = '',
  phone = '',
  address = '',
  message = '',
}) {
  return (
    <Section id="contact">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight">{heading}</h2>
        {message ? <p className="mt-4 text-gray-600 leading-relaxed">{message}</p> : null}
        <div className="mt-8 space-y-2 text-gray-700">
          {email ? (
            <p>
              <a href={\`mailto:\${email}\`} className="font-medium text-[var(--color-primary)]">
                {email}
              </a>
            </p>
          ) : null}
          {phone ? <p>{phone}</p> : null}
          {address ? <p className="text-gray-600">{address}</p> : null}
        </div>
      </div>
    </Section>
  );
}

function FooterSection({ text = '', columns = [], links = [] }) {
  const resolvedColumns =
    Array.isArray(columns) && columns.length > 0
      ? columns
      : Array.isArray(links) && links.length > 0
        ? [{ title: 'Links', links }]
        : [];
  const hasColumns = resolvedColumns.length > 0;
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      {hasColumns ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 px-6 max-w-7xl mx-auto">
          {resolvedColumns.map((column, index) => (
            <div key={\`\${column.title}-\${index}\`}>
              <h3 className="font-semibold text-gray-900 mb-4">{column.title}</h3>
              <ul className="space-y-2.5 text-sm text-gray-600 list-none m-0 p-0">
                {(column.links || [])
                  .filter((link) => String(link.label || '').toLowerCase() !== 'home')
                  .map((link, linkIndex) => (
                  <li key={\`\${link.label}-\${linkIndex}\`}>
                    <a href={link.href || '#'} className="text-sm text-gray-600 hover:text-gray-900">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}
      <div className="max-w-7xl mx-auto px-6 border-t border-gray-200 pt-6 pb-10">
        <p className="text-sm text-gray-500">
          {text || \`© \${new Date().getFullYear()} All rights reserved.\`}
        </p>
      </div>
    </footer>
  );
}

const SECTION_MAP = {
  Navbar: NavbarSection,
  Hero: HeroSection,
  About: AboutSection,
  Skills: SkillsSection,
  Services: ServicesSection,
  Projects: ProjectsSection,
  Testimonials: TestimonialsSection,
  Pricing: PricingSection,
  FAQ: FAQSection,
  Gallery: GallerySection,
  CTA: CTASection,
  Contact: ContactSection,
  Footer: FooterSection,
};

export default function App() {
  const blocks = useMemo(
    () => (Array.isArray(websiteData.components) ? websiteData.components : []),
    [],
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      {blocks.map((block, index) => {
        const Component = SECTION_MAP[block.type];
        if (!Component) return null;
        return (
          <Component
            key={block.id || \`\${block.type}-\${index}\`}
            {...(block.props || {})}
          />
        );
      })}
    </div>
  );
}
`;
}

function buildReadme(title) {
  return `# ${title}

Exported from [WebStructura](https://webstructura.netlify.app) as a Vite + React + Tailwind CSS project.

## Quick start

\`\`\`bash
npm install
npm run dev
\`\`\`

## Scripts

- \`npm run dev\` — local Vite development server
- \`npm run build\` — production build to \`dist/\`
- \`npm run preview\` — preview the production build

Your site content lives in \`src/App.jsx\` as the \`websiteData\` object and is mapped into Tailwind-styled sections.
`;
}

/**
 * Build a JSZip archive for a complete React + Vite + Tailwind project.
 * @param {object} websiteData
 * @param {{ projectName?: string }} [options]
 * @returns {Promise<import('jszip')>}
 */
export async function buildProjectZip(websiteData, options = {}) {
  const data = sanitizeWebsiteData(websiteData);
  const title = options.projectName?.trim() || data.title;
  const zip = new JSZip();

  zip.file('package.json', buildPackageJson(title));
  zip.file('tailwind.config.js', buildTailwindConfig());
  zip.file('postcss.config.js', buildPostcssConfig());
  zip.file('vite.config.js', buildViteConfig());
  zip.file('index.html', buildIndexHtml(title));
  zip.file('README.md', buildReadme(title));
  zip.file('.gitignore', `node_modules\ndist\n.DS_Store\n*.local\n`);

  const src = zip.folder('src');
  src.file('main.jsx', buildMainJsx());
  src.file('index.css', buildIndexCss(data.theme));
  src.file('App.jsx', buildAppJsx({ ...data, title }));

  return zip;
}

/**
 * @param {object} websiteData
 * @param {{ projectName?: string }} [options]
 * @returns {Promise<Buffer>}
 */
export async function generateExportZipBuffer(websiteData, options = {}) {
  const zip = await buildProjectZip(websiteData, options);
  return zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}
