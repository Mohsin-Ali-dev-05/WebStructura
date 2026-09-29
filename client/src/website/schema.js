/**
 * Allowed website block types and their default props.
 * The renderer only mounts components listed here — never eval() or dynamic code.
 */

export const COMPONENT_TYPES = [
  'Navbar',
  'Hero',
  'About',
  'Skills',
  'Services',
  'Projects',
  'Testimonials',
  'Pricing',
  'FAQ',
  'Gallery',
  'CTA',
  'Contact',
  'Footer',
];

export const DEFAULT_PROPS = {
  Navbar: {
    brand: 'My Website',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Services', href: '#services' },
      { label: 'Contact', href: '#contact' },
    ],
  },
  Hero: {
    title: 'Welcome',
    subtitle: 'Build modern websites with a simple structured builder.',
    ctaLabel: 'Get started',
    ctaHref: '#contact',
  },
  About: {
    heading: 'About',
    body: 'Share a short introduction about yourself or your business.',
  },
  Skills: {
    heading: 'Skills',
    items: [
      { name: 'HTML & CSS', level: 'Advanced' },
      { name: 'JavaScript', level: 'Intermediate' },
      { name: 'React', level: 'Intermediate' },
    ],
  },
  Services: {
    heading: 'Services',
    items: [
      {
        title: 'Web Design',
        description: 'Clean layouts focused on clarity and usability.',
      },
      {
        title: 'Frontend Development',
        description: 'Responsive interfaces built with modern tools.',
      },
    ],
  },
  Projects: {
    heading: 'Projects',
    items: [
      {
        title: 'Portfolio Site',
        description: 'A personal portfolio built with React.',
        link: '#',
      },
    ],
  },
  Testimonials: {
    heading: 'Testimonials',
    items: [
      {
        quote: 'Working together was smooth and the final site looked great.',
        author: 'Alex Rivera',
        role: 'Client',
      },
    ],
  },
  Pricing: {
    heading: 'Pricing',
    subheading: 'Simple plans for teams of every size.',
    featuredTier: 'Pro',
    tiers: [
      {
        name: 'Starter',
        price: '$12',
        period: 'mo',
        description: 'For solo makers shipping their first site.',
        features: ['1 project', 'Live preview', 'Email support'],
        ctaLabel: 'Choose Starter',
        ctaHref: '#contact',
      },
      {
        name: 'Pro',
        price: '$29',
        period: 'mo',
        description: 'For growing teams that need more polish.',
        features: [
          'Unlimited projects',
          'Custom themes',
          'Priority support',
          'AI draft assist',
        ],
        highlighted: true,
        ctaLabel: 'Choose Pro',
        ctaHref: '#contact',
      },
      {
        name: 'Business',
        price: '$79',
        period: 'mo',
        description: 'For studios managing multiple clients.',
        features: ['Everything in Pro', 'Team seats', 'SLA support'],
        ctaLabel: 'Contact sales',
        ctaHref: '#contact',
      },
    ],
  },
  FAQ: {
    heading: 'Frequently asked questions',
    items: [
      {
        question: 'Do I need to know how to code?',
        answer:
          'No. WebStructura uses structured sections and a live preview so you can build visually.',
      },
      {
        question: 'Can I change the theme later?',
        answer:
          'Yes. Update colors and typography in the builder and the preview updates immediately.',
      },
      {
        question: 'Is AI required?',
        answer:
          'AI is optional. You can create and edit every section manually.',
      },
    ],
  },
  Gallery: {
    heading: 'Gallery',
    subheading: 'A few recent highlights.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        alt: 'Bright modern workspace',
      },
      {
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        alt: 'Analytics dashboard on a laptop',
      },
      {
        url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
        alt: 'Team collaborating at a table',
      },
      {
        url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
        alt: 'Product team discussion',
      },
      {
        url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
        alt: 'Office meeting room',
      },
    ],
  },
  CTA: {
    heading: 'Ready to launch your next site?',
    body: 'Create a project, compose polished sections, and preview every change instantly.',
    ctaLabel: 'Start building',
    ctaHref: '#contact',
    secondaryLabel: 'View pricing',
    secondaryHref: '#pricing',
  },
  Contact: {
    heading: 'Contact',
    email: 'hello@example.com',
    phone: '',
    address: '',
    message: 'Send a message and I will get back to you soon.',
  },
  Footer: {
    text: '© Your Name. All rights reserved.',
    links: [{ label: 'Home', href: '#' }],
  },
};

export const DEFAULT_THEME = {
  primaryColor: '#1d4ed8',
  backgroundColor: '#ffffff',
  textColor: '#14213d',
  font: 'Georgia, "Times New Roman", serif',
};

export function createComponentId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `cmp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function createComponent(type, props = {}) {
  if (!COMPONENT_TYPES.includes(type)) {
    throw new Error(`Unknown component type: ${type}`);
  }

  return {
    id: createComponentId(),
    type,
    props: {
      ...DEFAULT_PROPS[type],
      ...props,
    },
  };
}

export function createDefaultWebsiteData(title = 'My Website') {
  return {
    title,
    theme: { ...DEFAULT_THEME },
    components: [
      createComponent('Navbar', { brand: title }),
      createComponent('Hero', {
        title,
        subtitle: 'A simple site built with the AI-Powered Website Builder.',
      }),
      createComponent('About'),
      createComponent('Contact'),
      createComponent('Footer', { text: `© ${title}. All rights reserved.` }),
    ],
  };
}

function stampListItemIds(list) {
  if (!Array.isArray(list)) {
    return list;
  }

  return list.map((entry) => {
    if (typeof entry === 'string') {
      return { url: entry, alt: 'Gallery image', _editorId: createComponentId() };
    }
    if (!entry || typeof entry !== 'object') {
      return entry;
    }
    if (typeof entry._editorId === 'string' && entry._editorId) {
      return entry;
    }
    return { ...entry, _editorId: createComponentId() };
  });
}

function normalizeComponentProps(type, props) {
  const next = {
    ...DEFAULT_PROPS[type],
    ...(props && typeof props === 'object' ? props : {}),
  };

  if (Array.isArray(next.links)) {
    next.links = stampListItemIds(next.links);
  }
  if (Array.isArray(next.items)) {
    next.items = stampListItemIds(next.items);
  }
  if (Array.isArray(next.tiers)) {
    next.tiers = stampListItemIds(next.tiers);
  }
  if (Array.isArray(next.images)) {
    next.images = stampListItemIds(next.images);
  }

  return next;
}

/**
 * Ensures websiteData is safe and complete for rendering.
 * Unknown types are dropped (never executed).
 * Nested list rows get stable _editorId for React keys.
 */
export function normalizeWebsiteData(websiteData = {}) {
  const title =
    typeof websiteData.title === 'string' && websiteData.title.trim()
      ? websiteData.title.trim()
      : 'My Website';

  const theme = {
    ...DEFAULT_THEME,
    ...(websiteData.theme && typeof websiteData.theme === 'object'
      ? websiteData.theme
      : {}),
  };

  const rawComponents = Array.isArray(websiteData.components)
    ? websiteData.components
    : [];

  const components = rawComponents
    .filter(
      (item) =>
        item &&
        typeof item === 'object' &&
        COMPONENT_TYPES.includes(item.type),
    )
    .map((item) => ({
      id: typeof item.id === 'string' && item.id ? item.id : createComponentId(),
      type: item.type,
      props: normalizeComponentProps(item.type, item.props),
    }));

  return {
    title,
    theme,
    components,
  };
}
