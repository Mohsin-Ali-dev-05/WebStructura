import axios from 'axios';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

const OLLAMA_TIMEOUT_MS = 90_000;

/** Matches builder component types (server-side allowlist). */
export const AI_SECTION_TYPES = [
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

/** Prop shapes the React renderer expects for each building block. */
const COMPONENT_PROP_HINTS = {
  Navbar: '{ "brand": string, "links": [{ "label": string, "href": string }] }',
  Hero: '{ "title": string, "subtitle": string, "ctaLabel": string, "ctaHref": string }',
  About: '{ "heading": string, "body": string }',
  Skills: '{ "heading": string, "items": [{ "name": string, "level": string }] }',
  Services:
    '{ "heading": string, "items": [{ "title": string, "description": string }] }',
  Projects:
    '{ "heading": string, "items": [{ "title": string, "description": string, "link": string }] }',
  Testimonials:
    '{ "heading": string, "items": [{ "quote": string, "author": string, "role": string }] }',
  Pricing:
    '{ "heading": string, "subheading": string, "featuredTier": string, "tiers": [{ "name": string, "price": string, "period": string, "description": string, "features": string[], "ctaLabel": string, "ctaHref": string }] }',
  FAQ: '{ "heading": string, "items": [{ "question": string, "answer": string }] }',
  Gallery:
    '{ "heading": string, "subheading": string, "images": [{ "url": string, "alt": string }] }',
  CTA: '{ "heading": string, "body": string, "ctaLabel": string, "ctaHref": string, "secondaryLabel": string, "secondaryHref": string }',
  Contact:
    '{ "heading": string, "email": string, "phone": string, "address": string, "message": string }',
  Footer: '{ "text": string, "links": [{ "label": string, "href": string }] }',
};

/**
 * Injects the full allowlist of React building blocks into the prompt
 * so the model only emits types the renderer can mount.
 */
export function buildAvailableComponentsCatalog() {
  return AI_SECTION_TYPES.map(
    (type) => `- ${type}: props ${COMPONENT_PROP_HINTS[type] || '{}'}`,
  ).join('\n');
}

/**
 * Builds the strict system prompt for section copy generation.
 * Constrains qwen2.5:3b to raw paragraph text only — never code.
 */
export function buildSectionSystemPrompt(sectionType, topic) {
  return (
    `You are an expert web copywriter. Write a highly professional, concise paragraph ` +
    `for a website ${sectionType} section based on this topic: ${topic}. ` +
    `Return ONLY the raw text. Do NOT include greetings, conversational filler, ` +
    `markdown formatting, or quotes.`
  );
}

/**
 * System prompt for full initial website JSON on project create.
 * Forces industry-aware layout variety — never a fixed generic section order.
 */
export function buildInitialWebsiteSystemPrompt(name, description) {
  const safeName = escapePromptValue(name, 'My Website');
  const safeDescription = escapePromptValue(
    description,
    'A professional website.',
  );
  const availableComponents = buildAvailableComponentsCatalog();

  return (
    `You are WebStructura's senior layout architect. You MUST avoid using the same generic layout. ` +
    `Analyze the user's requested industry and dynamically select the most appropriate sequence of components ` +
    `(e.g., a portfolio needs a gallery block first, a SaaS needs a pricing block). ` +
    `Never use the exact same component order twice.\n\n` +
    `The user is building a website named "${safeName}".\n` +
    `Business description: "${safeDescription}".\n\n` +
    `AVAILABLE REACT COMPONENTS (use ONLY these type names — they are the real building blocks in the product):\n` +
    `${availableComponents}\n\n` +
    `LAYOUT RULES:\n` +
    `- Choose 5–9 components that fit this specific industry/niche. Do NOT default to Hero → About → Services → Footer every time.\n` +
    `- Start with Navbar (brand = "${safeName}") when navigation makes sense; end with Footer.\n` +
    `- Reorder and swap middle sections based on the description (Gallery/Projects for creatives, Pricing/FAQ for SaaS, Skills/Projects for freelancers, Testimonials/CTA for agencies, etc.).\n` +
    `- Write ALL copy from the description — no generic filler like "Welcome to our website" or "Lorem ipsum".\n` +
    `- Every object MUST be { "type": "<ComponentName>", "props": { ... } } matching the prop shapes above.\n\n` +
    `Reply with ONLY a minified JSON array of components. No markdown fences, no greetings, no explanations.`
  );
}

function escapePromptValue(value, fallback) {
  const trimmed = String(value || '').trim();
  const base = trimmed || fallback;
  // Prevent breaking out of quoted prompt segments
  return base.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

/** Default Hero → About → Services → Footer when Ollama fails or returns invalid JSON. */
export function getBlankWebsiteComponents(name = 'My Website') {
  const brand = String(name || 'My Website').trim() || 'My Website';

  return [
    {
      type: 'Hero',
      props: {
        title: brand,
        subtitle:
          'A clear, modern presence for your business. Update this copy in the builder anytime.',
        ctaLabel: 'Get started',
        ctaHref: '#contact',
      },
    },
    {
      type: 'About',
      props: {
        heading: 'About',
        body: 'Tell your story. Share what you do, who you serve, and why customers choose you.',
      },
    },
    {
      type: 'Services',
      props: {
        heading: 'Services',
        items: [
          {
            title: 'Core offering',
            description: 'Describe your primary service or product.',
          },
          {
            title: 'Support',
            description: 'Highlight how you help clients succeed.',
          },
          {
            title: 'Delivery',
            description: 'Explain how you ship results with confidence.',
          },
        ],
      },
    },
    {
      type: 'Footer',
      props: {
        text: `© 2026 ${brand}. All rights reserved.`,
        links: [{ label: 'Home', href: '#top' }],
      },
    },
  ].map(normalizeGeneratedComponent);
}

/**
 * Calls local Ollama (qwen2.5:3b) via Axios and returns a components array.
 * Never throws for parse/hallucination failures — returns the blank template instead.
 */
export async function generateInitialWebsiteComponents(name, description) {
  const safeName = String(name || 'My Website').trim() || 'My Website';
  const safeDescription =
    String(description || '').trim() || 'A professional website.';
  const system = buildInitialWebsiteSystemPrompt(safeName, safeDescription);
  const url = `${env.ollamaBaseUrl}/api/generate`;

  try {
    const response = await axios.post(
      url,
      {
        model: env.ollamaModel,
        prompt:
          `Design a UNIQUE layout for this industry and return ONLY the minified JSON component array. ` +
          `Pick component types and order that fit this business — do not reuse a generic Hero/About/Services/Footer stack. ` +
          `Business description: ${safeDescription}`,
        system,
        stream: false,
        format: 'json',
        options: {
          temperature: 0.7,
          top_p: 0.9,
        },
      },
      {
        timeout: OLLAMA_TIMEOUT_MS,
        headers: { 'Content-Type': 'application/json' },
        validateStatus: (status) => status >= 200 && status < 300,
      },
    );

    const raw =
      typeof response.data?.response === 'string'
        ? response.data.response.trim()
        : '';

    if (!raw) {
      return getBlankWebsiteComponents(safeName);
    }

    try {
      const parsed = JSON.parse(stripJsonFences(raw));
      const components = coerceComponentsArray(parsed);

      if (!components) {
        return getBlankWebsiteComponents(safeName);
      }

      const normalized = components
        .map(normalizeGeneratedComponent)
        .filter(Boolean);

      return normalized.length > 0
        ? normalized
        : getBlankWebsiteComponents(safeName);
    } catch {
      // AI hallucinated / invalid JSON — do not crash project create
      return getBlankWebsiteComponents(safeName);
    }
  } catch {
    // Ollama offline, timeout, or network error — safe fallback
    return getBlankWebsiteComponents(safeName);
  }
}

function stripJsonFences(value) {
  let text = String(value).trim();
  text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  return text;
}

function coerceComponentsArray(parsed) {
  if (Array.isArray(parsed)) {
    return parsed.length > 0 ? parsed : null;
  }

  if (parsed && typeof parsed === 'object') {
    if (Array.isArray(parsed.components) && parsed.components.length > 0) {
      return parsed.components;
    }
    if (Array.isArray(parsed.data) && parsed.data.length > 0) {
      return parsed.data;
    }
  }

  return null;
}

function createComponentId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `cmp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Whitelist type, ensure props object, and map AI fields onto renderer schema.
 * - About.content → body
 * - Services.features (comma string) → items[{ title, description }]
 */
function normalizeGeneratedComponent(item) {
  if (!item || typeof item !== 'object' || typeof item.type !== 'string') {
    return null;
  }

  const type = item.type.trim();
  if (!AI_SECTION_TYPES.includes(type)) {
    return null;
  }

  const rawProps =
    item.props && typeof item.props === 'object' && !Array.isArray(item.props)
      ? { ...item.props }
      : {};

  if (type === 'Hero') {
    if (!rawProps.ctaLabel) {
      rawProps.ctaLabel = 'Get started';
    }
    if (!rawProps.ctaHref) {
      rawProps.ctaHref = '#contact';
    }
  }

  if (type === 'About') {
    if (typeof rawProps.content === 'string' && !rawProps.body) {
      rawProps.body = rawProps.content;
    }
    if (!rawProps.heading) {
      rawProps.heading = 'About';
    }
    delete rawProps.content;
  }

  if (type === 'Services') {
    if (!rawProps.heading) {
      rawProps.heading = 'Services';
    }

    if (!Array.isArray(rawProps.items) || rawProps.items.length === 0) {
      const fromFeatures = featuresToServiceItems(rawProps.features);
      if (fromFeatures.length > 0) {
        rawProps.items = fromFeatures;
      }
    }

    delete rawProps.features;
  }

  return {
    id:
      typeof item.id === 'string' && item.id.trim()
        ? item.id.trim()
        : createComponentId(),
    type,
    props: rawProps,
  };
}

/** Turn "A, B, C" (or string[]) into Services items the UI can render. */
function featuresToServiceItems(features) {
  let labels = [];

  if (typeof features === 'string') {
    labels = features
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);
  } else if (Array.isArray(features)) {
    labels = features
      .map((entry) => {
        if (typeof entry === 'string') {
          return entry.trim();
        }
        if (entry && typeof entry === 'object') {
          return String(entry.title || entry.name || entry.label || '').trim();
        }
        return '';
      })
      .filter(Boolean);
  }

  return labels.slice(0, 6).map((title) => ({
    title,
    description: `Learn more about ${title}.`,
  }));
}

/**
 * Backend-only Ollama client (fetch) for section copy endpoints.
 * React never calls Ollama directly — all AI traffic goes through Express.
 * Responses are treated as plain text / data only — never executed as code.
 *
 * @param {string} prompt - User / topic prompt sent to /api/generate
 * @param {{ system?: string }} [options]
 */
export async function generateText(prompt, options = {}) {
  const url = `${env.ollamaBaseUrl}/api/generate`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT_MS);

  const body = {
    model: env.ollamaModel,
    prompt,
    stream: false,
  };

  if (typeof options.system === 'string' && options.system.trim()) {
    body.system = options.system.trim();
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      const detail = await safeReadBody(response);
      throw new AppError(
        `Ollama request failed (${response.status}). ${detail || 'Check that the model is pulled and Ollama is running.'}`,
        502,
      );
    }

    let payload;
    try {
      payload = await response.json();
    } catch {
      throw new AppError(
        'Ollama returned a non-JSON response. The AI service could not be parsed safely.',
        502,
      );
    }

    const raw =
      typeof payload?.response === 'string' ? payload.response.trim() : '';

    if (!raw) {
      throw new AppError(
        'Ollama returned an empty or invalid response. Try a shorter prompt or verify the model is loaded.',
        502,
      );
    }

    const text = sanitizeModelText(raw);

    if (!text) {
      throw new AppError(
        'Ollama returned content that could not be cleaned into usable copy.',
        502,
      );
    }

    // Plain text only — never eval / Function / dynamic import of model output
    return {
      text,
      model: typeof payload.model === 'string' ? payload.model : env.ollamaModel,
      done: Boolean(payload.done),
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error.name === 'AbortError') {
      throw new AppError(
        'Ollama timed out. The model may still be loading, or the machine is under memory pressure.',
        504,
      );
    }

    if (error.cause?.code === 'ECONNREFUSED' || error.code === 'ECONNREFUSED') {
      throw new AppError(
        `Cannot reach Ollama at ${env.ollamaBaseUrl}. Start Ollama and confirm the model "${env.ollamaModel}" is available.`,
        503,
      );
    }

    throw new AppError(
      error.message || 'Unexpected error while contacting the local AI service.',
      503,
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Production helper: section-aware copy via constrained system prompt.
 */
export async function generateSectionCopy(prompt, sectionType) {
  const system = buildSectionSystemPrompt(sectionType, prompt);
  return generateText(prompt, { system });
}

/**
 * Strip common model extras (wrapping quotes, markdown fences) without executing anything.
 */
function sanitizeModelText(value) {
  let text = String(value).trim();

  // Drop markdown code fences if the model ignores instructions
  text = text.replace(/^```[\w]*\s*/i, '').replace(/\s*```$/i, '').trim();

  // Unwrap a single pair of wrapping quotes
  if (
    (text.startsWith('"') && text.endsWith('"')) ||
    (text.startsWith("'") && text.endsWith("'"))
  ) {
    text = text.slice(1, -1).trim();
  }

  return text;
}

async function safeReadBody(response) {
  try {
    const text = await response.text();
    return text.slice(0, 300);
  } catch {
    return '';
  }
}
