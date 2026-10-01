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

/**
 * Prop shapes the React renderer expects.
 * imageKeyword is resolved server-side into a loremflickr.com URL.
 */
const COMPONENT_PROP_HINTS = {
  Navbar:
    '{ "brand": string, "links": [{ "label": string, "href": string }] }',
  Hero:
    '{ "title": string, "subtitle": string, "ctaLabel": string, "ctaHref": string, "secondaryLabel": string, "secondaryHref": string, "imageKeyword": string, "imageAlt": string }',
  About:
    '{ "heading": string, "body": string, "imageKeyword": string, "imageAlt": string }',
  Skills: '{ "heading": string, "items": [{ "name": string, "level": string }] }',
  Services:
    '{ "heading": string, "subheading": string, "items": [{ "title": string, "description": string, "imageKeyword": string }] }',
  Projects:
    '{ "heading": string, "items": [{ "title": string, "description": string, "link": string, "imageKeyword": string }] }',
  Testimonials:
    '{ "heading": string, "items": [{ "quote": string, "author": string, "role": string }] }',
  Pricing:
    '{ "heading": string, "subheading": string, "featuredTier": string, "tiers": [{ "name": string, "price": string, "period": string, "description": string, "features": string[], "ctaLabel": string, "ctaHref": string }] }',
  FAQ: '{ "heading": string, "items": [{ "question": string, "answer": string }] }',
  Gallery:
    '{ "heading": string, "subheading": string, "images": [{ "imageKeyword": string, "alt": string }] }',
  CTA: '{ "heading": string, "body": string, "ctaLabel": string, "ctaHref": string, "secondaryLabel": string, "secondaryHref": string }',
  Contact:
    '{ "heading": string, "email": string, "phone": string, "address": string, "message": string }',
  Footer:
    '{ "text": string, "columns": [{ "title": string, "links": [{ "label": string, "href": string }] }] }',
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
 * Requires industry-specific sales copy + imageKeyword fields for photos.
 */
export function buildInitialWebsiteSystemPrompt(name, description) {
  const safeName = escapePromptValue(name, 'My Website');
  const safeDescription = escapePromptValue(
    description,
    'A professional website.',
  );
  const availableComponents = buildAvailableComponentsCatalog();

  return (
    `You are WebStructura's senior conversion copywriter AND layout architect.\n` +
    `Your job is to generate a COMPLETE, tailored website for ONE specific business — never a generic wireframe.\n\n` +
    `SITE NAME: "${safeName}"\n` +
    `BUSINESS / PRODUCT DESCRIPTION: "${safeDescription}"\n\n` +
    `CRITICAL — INDUSTRY-SPECIFIC COPY:\n` +
    `- Read the description carefully and write REAL sales copy for that niche.\n` +
    `- Example: if the topic is "Cafeteria Management System", write about food inventory, POS checkout, meal plans, kitchen operations, and staff scheduling — NOT "Tell your story" or "Welcome to our website".\n` +
    `- Ban ALL generic filler: "Tell your story", "Lorem ipsum", "Core offering", "Get started today" without context, "We help businesses grow", placeholder labels.\n` +
    `- Every headline, subtitle, feature title, and feature description must mention concrete benefits for THIS industry.\n\n` +
    `REQUIRED STRUCTURE (use exactly these types in this order unless the niche clearly needs Pricing or Gallery inserted before Footer):\n` +
    `1) Navbar — brand = "${safeName}", 3–5 relevant anchor links (e.g. Features, Solutions, Pricing, Contact).\n` +
    `2) Hero — compelling industry headline, benefit-driven subheadline, primary + secondary CTAs, and imageKeyword (1–3 lowercase photo tags, e.g. "cafeteria,food" or "restaurant,kitchen").\n` +
    `3) Services — treat as FEATURES: heading like "Features" or "What you get", plus 3–4 items. Each item needs title, description (2–3 sentences of real product copy), and imageKeyword.\n` +
    `4) Optional middle sections from the catalog (About, Testimonials, Pricing, FAQ, CTA, Contact) ONLY if they fit the niche — still industry-specific copy.\n` +
    `5) Footer — copyright text plus a multi-column link grid: props.columns is an array of exactly 3 objects with titles "Product", "Visit", and "Company". Each has "links": [{ "label", "href" }] (2–4 niche-relevant links per column). Never include a "Home" link (navbar covers that). Do NOT use a flat links array.\n\n` +
    `AVAILABLE REACT COMPONENTS (use ONLY these type names):\n` +
    `${availableComponents}\n\n` +
    `IMAGE KEYWORDS:\n` +
    `- For Hero, About, each Services item, Projects items, and Gallery images, include "imageKeyword": a short lowercase tag string (comma-separated OK).\n` +
    `- Keywords must match the business (food, cafeteria, inventory, saas, dashboard, etc.). Never leave them blank for Hero/Services.\n` +
    `- Do NOT invent full image URLs — only imageKeyword strings. The server will turn them into photos.\n\n` +
    `OUTPUT FORMAT:\n` +
    `- Reply with ONLY a minified JSON array of { "type": "<ComponentName>", "props": { ... } }.\n` +
    `- No markdown fences, no greetings, no explanations.\n` +
    `- Prefer 6–9 components total. Always include Navbar, Hero, Services (features), and Footer.`
  );
}

function escapePromptValue(value, fallback) {
  const trimmed = String(value || '').trim();
  const base = trimmed || fallback;
  return base.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

/**
 * Build a LoremFlickr URL from a keyword/tag string.
 * @param {string} keyword
 * @param {number} [width]
 * @param {number} [height]
 */
export function buildLoremFlickrUrl(keyword, width = 800, height = 600) {
  const cleaned = String(keyword || '')
    .toLowerCase()
    .replace(/[^a-z0-9,\s-]/g, ' ')
    .trim()
    .replace(/[\s-]+/g, ',')
    .replace(/,+/g, ',')
    .replace(/^,|,$/g, '')
    .slice(0, 80);

  const tags = cleaned || 'business';
  const w = Number.isFinite(width) ? Math.max(200, Math.min(1600, width)) : 800;
  const h = Number.isFinite(height) ? Math.max(200, Math.min(1200, height)) : 600;
  return `https://loremflickr.com/${w}/${h}/${tags}`;
}

function inferImageKeyword(name, description) {
  const haystack = `${name} ${description}`.toLowerCase();
  const pairs = [
    [/cafeteria|canteen|food|meal|kitchen|restaurant|dining/, 'cafeteria,food'],
    [/real.?estate|property|home|housing|apartment/, 'realestate,house'],
    [/e-?commerce|shop|store|retail|product/, 'shopping,retail'],
    [/saas|software|app|platform|dashboard|tech/, 'technology,office'],
    [/portfolio|design|creative|agency|studio/, 'design,workspace'],
    [/blog|news|media|content|writer/, 'writing,laptop'],
    [/fitness|gym|health|wellness/, 'fitness,gym'],
    [/education|school|course|learn|tutor/, 'education,classroom'],
    [/finance|bank|fintech|accounting/, 'finance,business'],
    [/hotel|travel|tourism/, 'travel,hotel'],
  ];

  for (const [pattern, keyword] of pairs) {
    if (pattern.test(haystack)) {
      return keyword;
    }
  }

  const tokens = haystack
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 3)
    .slice(0, 2);
  return tokens.length > 0 ? tokens.join(',') : 'business';
}

/** Industry-aware fallback when Ollama fails or returns invalid JSON. */
export function getBlankWebsiteComponents(name = 'My Website', description = '') {
  const brand = String(name || 'My Website').trim() || 'My Website';
  const desc =
    String(description || '').trim() ||
    `Professional tools and services for ${brand}.`;
  const keyword = inferImageKeyword(brand, desc);
  const featureKeyword = keyword.split(',')[0] || 'business';

  return [
    {
      type: 'Navbar',
      props: {
        brand,
        links: [
          { label: 'Features', href: '#services' },
          { label: 'About', href: '#about' },
          { label: 'Contact', href: '#contact' },
        ],
      },
    },
    {
      type: 'Hero',
      props: {
        title: `${brand} — built for how you actually work`,
        subtitle: desc,
        ctaLabel: 'Request a demo',
        ctaHref: '#contact',
        secondaryLabel: 'See features',
        secondaryHref: '#services',
        imageKeyword: keyword,
        imageAlt: `${brand} product preview`,
      },
    },
    {
      type: 'Services',
      props: {
        heading: 'Features that matter',
        subheading: `Practical capabilities tailored to ${brand}.`,
        items: [
          {
            title: 'Operations dashboard',
            description: `Monitor the metrics that matter for ${brand} in one clear view so teams stay aligned.`,
            imageKeyword: featureKeyword,
          },
          {
            title: 'Workflow automation',
            description:
              'Reduce manual busywork with guided flows that keep inventory, staff, and customers in sync.',
            imageKeyword: `${featureKeyword},office`,
          },
          {
            title: 'Reporting & insights',
            description:
              'Export actionable reports and spot trends before they become expensive problems.',
            imageKeyword: `${featureKeyword},analytics`,
          },
        ],
      },
    },
    {
      type: 'About',
      props: {
        heading: `Why teams choose ${brand}`,
        body: desc,
        imageKeyword: keyword,
        imageAlt: brand,
      },
    },
    {
      type: 'Footer',
      props: {
        text: `© ${new Date().getFullYear()} ${brand}. All rights reserved.`,
        columns: [
          {
            title: 'Product',
            links: [
              { label: 'Features', href: '#services' },
              { label: 'Pricing', href: '#pricing' },
            ],
          },
          {
            title: 'Visit',
            links: [
              { label: 'About', href: '#about' },
              { label: 'FAQ', href: '#faq' },
            ],
          },
          {
            title: 'Company',
            links: [
              { label: 'Contact', href: '#contact' },
              { label: 'Support', href: '#contact' },
            ],
          },
        ],
      },
    },
  ].map((item) => normalizeGeneratedComponent(item));
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
          `Generate a COMPLETE tailored website JSON array for this business. ` +
          `Write industry-specific sales copy (no generic placeholders). ` +
          `MUST include Navbar, Hero (with imageKeyword), Services/features (3–4 items each with imageKeyword), and Footer. ` +
          `Business description: ${safeDescription}`,
        system,
        stream: false,
        format: 'json',
        options: {
          temperature: 0.55,
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
      return getBlankWebsiteComponents(safeName, safeDescription);
    }

    try {
      const parsed = JSON.parse(stripJsonFences(raw));
      const components = coerceComponentsArray(parsed);

      if (!components) {
        return getBlankWebsiteComponents(safeName, safeDescription);
      }

      const normalized = components
        .map((item) => normalizeGeneratedComponent(item))
        .filter(Boolean);

      const ensured = ensureRequiredSections(
        normalized,
        safeName,
        safeDescription,
      );

      return ensured.length > 0
        ? ensured
        : getBlankWebsiteComponents(safeName, safeDescription);
    } catch {
      return getBlankWebsiteComponents(safeName, safeDescription);
    }
  } catch {
    return getBlankWebsiteComponents(safeName, safeDescription);
  }
}

/** Guarantee Navbar / Hero / Services / Footer exist after AI output. */
function ensureRequiredSections(components, name, description) {
  const list = Array.isArray(components) ? [...components] : [];
  const types = new Set(list.map((c) => c.type));
  const fallback = getBlankWebsiteComponents(name, description);

  function takeFallback(type) {
    return fallback.find((c) => c.type === type);
  }

  if (!types.has('Navbar')) {
    list.unshift(takeFallback('Navbar'));
  }
  if (!types.has('Hero')) {
    const navIndex = list.findIndex((c) => c.type === 'Navbar');
    list.splice(navIndex + 1, 0, takeFallback('Hero'));
  }
  if (!types.has('Services')) {
    const heroIndex = list.findIndex((c) => c.type === 'Hero');
    list.splice(heroIndex + 1, 0, takeFallback('Services'));
  }
  if (!types.has('Footer')) {
    list.push(takeFallback('Footer'));
  }

  return list.filter(Boolean);
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
    if (Array.isArray(parsed.sections) && parsed.sections.length > 0) {
      return parsed.sections;
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

function applyImageFromKeyword(target, keyword, width, height, altFallback) {
  if (!target || typeof target !== 'object') {
    return;
  }

  const key =
    typeof keyword === 'string' && keyword.trim()
      ? keyword.trim()
      : typeof target.imageKeyword === 'string'
        ? target.imageKeyword.trim()
        : '';

  const existingImage = typeof target.image === 'string' ? target.image.trim() : '';
  const looksLikePlaceholder =
    !existingImage ||
    /placehold|via\.placeholder|example\.com|gray|placeholder/i.test(
      existingImage,
    );

  if (key) {
    target.imageKeyword = key;
    if (looksLikePlaceholder) {
      target.image = buildLoremFlickrUrl(key, width, height);
    }
    if (!target.imageAlt && altFallback) {
      target.imageAlt = altFallback;
    }
    return;
  }

  if (looksLikePlaceholder && altFallback) {
    target.imageKeyword = inferImageKeyword(altFallback, '');
    target.image = buildLoremFlickrUrl(target.imageKeyword, width, height);
    if (!target.imageAlt) {
      target.imageAlt = altFallback;
    }
  }
}

/**
 * Whitelist type, ensure props object, map AI fields onto renderer schema,
 * and resolve imageKeyword → loremflickr URLs.
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

  if (type === 'Navbar') {
    if (!rawProps.brand) {
      rawProps.brand = 'My Website';
    }
    if (!Array.isArray(rawProps.links) || rawProps.links.length === 0) {
      rawProps.links = [
        { label: 'Features', href: '#services' },
        { label: 'Contact', href: '#contact' },
      ];
    }
  }

  if (type === 'Hero') {
    if (!rawProps.ctaLabel) {
      rawProps.ctaLabel = 'Get a demo';
    }
    if (!rawProps.ctaHref) {
      rawProps.ctaHref = '#contact';
    }
    if (!rawProps.secondaryLabel) {
      rawProps.secondaryLabel = 'See features';
    }
    if (!rawProps.secondaryHref) {
      rawProps.secondaryHref = '#services';
    }
    applyImageFromKeyword(
      rawProps,
      rawProps.imageKeyword,
      800,
      600,
      rawProps.title || 'Hero',
    );
  }

  if (type === 'About') {
    if (typeof rawProps.content === 'string' && !rawProps.body) {
      rawProps.body = rawProps.content;
    }
    if (!rawProps.heading) {
      rawProps.heading = 'About';
    }
    delete rawProps.content;
    applyImageFromKeyword(
      rawProps,
      rawProps.imageKeyword,
      800,
      600,
      rawProps.heading,
    );
  }

  if (type === 'Services') {
    if (!rawProps.heading) {
      rawProps.heading = 'Features';
    }

    if (!Array.isArray(rawProps.items) || rawProps.items.length === 0) {
      const fromFeatures = featuresToServiceItems(rawProps.features);
      if (fromFeatures.length > 0) {
        rawProps.items = fromFeatures;
      }
    }

    if (Array.isArray(rawProps.items)) {
      rawProps.items = rawProps.items.slice(0, 4).map((entry) => {
        const item =
          entry && typeof entry === 'object'
            ? { ...entry }
            : { title: String(entry || 'Feature'), description: '' };
        applyImageFromKeyword(
          item,
          item.imageKeyword,
          800,
          600,
          item.title || 'Feature',
        );
        // Services cards read `image`
        if (item.image && !item.url) {
          /* keep image */
        }
        return item;
      });
    }

    delete rawProps.features;
  }

  if (type === 'Projects' && Array.isArray(rawProps.items)) {
    rawProps.items = rawProps.items.map((entry) => {
      const item =
        entry && typeof entry === 'object'
          ? { ...entry }
          : { title: String(entry || 'Project'), description: '' };
      applyImageFromKeyword(
        item,
        item.imageKeyword,
        800,
        600,
        item.title || 'Project',
      );
      return item;
    });
  }

  if (type === 'Gallery' && Array.isArray(rawProps.images)) {
    rawProps.images = rawProps.images.map((entry) => {
      const image =
        entry && typeof entry === 'object'
          ? { ...entry }
          : { alt: 'Gallery image' };
      const key = image.imageKeyword || image.keyword;
      if (key && !image.url) {
        image.url = buildLoremFlickrUrl(key, 1200, 800);
        image.imageKeyword = key;
      }
      if (!image.alt) {
        image.alt = key || 'Gallery image';
      }
      return image;
    });
  }

  if (type === 'Footer') {
    if (!rawProps.text) {
      rawProps.text = `© ${new Date().getFullYear()} All rights reserved.`;
    }

    const hasColumns =
      Array.isArray(rawProps.columns) && rawProps.columns.length > 0;

    if (!hasColumns && Array.isArray(rawProps.links) && rawProps.links.length > 0) {
      rawProps.columns = [
        {
          title: 'Links',
          links: rawProps.links,
        },
      ];
    }

    if (!Array.isArray(rawProps.columns) || rawProps.columns.length === 0) {
      rawProps.columns = [
        {
          title: 'Product',
          links: [
            { label: 'Features', href: '#services' },
            { label: 'Pricing', href: '#pricing' },
          ],
        },
        {
          title: 'Visit',
          links: [
            { label: 'About', href: '#about' },
            { label: 'FAQ', href: '#faq' },
          ],
        },
        {
          title: 'Company',
          links: [
            { label: 'Contact', href: '#contact' },
            { label: 'Support', href: '#contact' },
          ],
        },
      ];
    }

    rawProps.columns = rawProps.columns
      .filter((column) => column && typeof column === 'object')
      .map((column) => ({
        title: String(column.title || 'Links').trim() || 'Links',
        links: Array.isArray(column.links)
          ? column.links
              .filter((link) => link && typeof link === 'object')
              .map((link) => ({
                label: String(link.label || 'Link').trim() || 'Link',
                href: String(link.href || '#').trim() || '#',
              }))
              .filter(
                (link) =>
                  link.label.toLowerCase() !== 'home' &&
                  link.href !== '#top',
              )
          : [],
      }))
      .filter((column) => column.links.length > 0);
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

  return labels.slice(0, 4).map((title) => ({
    title,
    description: `Discover how ${title} helps your team deliver better results every day.`,
    imageKeyword: title.toLowerCase().replace(/[^a-z0-9]+/g, ',').replace(/^,|,$/g, '') || 'business',
  }));
}

/**
 * Backend-only Ollama client (fetch) for section copy endpoints.
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

export async function generateSectionCopy(prompt, sectionType) {
  const system = buildSectionSystemPrompt(sectionType, prompt);
  return generateText(prompt, { system });
}

/**
 * Parse accumulated Ollama JSON into normalized website components.
 * Used after a streaming generate finishes (or as a fallback).
 */
export function parseAndNormalizeWebsiteComponents(
  rawText,
  name = 'My Website',
  description = '',
) {
  const safeName = String(name || 'My Website').trim() || 'My Website';
  const safeDescription =
    String(description || '').trim() || 'A professional website.';

  try {
    const parsed = JSON.parse(stripJsonFences(rawText));
    const components = coerceComponentsArray(parsed);
    if (!components) {
      return getBlankWebsiteComponents(safeName, safeDescription);
    }

    const normalized = components
      .map((item) => normalizeGeneratedComponent(item))
      .filter(Boolean);

    const ensured = ensureRequiredSections(
      normalized,
      safeName,
      safeDescription,
    );

    return ensured.length > 0
      ? ensured
      : getBlankWebsiteComponents(safeName, safeDescription);
  } catch {
    return getBlankWebsiteComponents(safeName, safeDescription);
  }
}

/**
 * Stream a full website JSON array from Ollama (stream: true).
 * Invokes onChunk(text) for each token; returns the concatenated response.
 */
export async function streamWebsiteGeneration(
  { name, description, prompt } = {},
  { onChunk, signal } = {},
) {
  const safeName = String(name || 'My Website').trim() || 'My Website';
  const safeDescription =
    String(description || prompt || '').trim() || 'A professional website.';
  const system = buildInitialWebsiteSystemPrompt(safeName, safeDescription);
  const url = `${env.ollamaBaseUrl}/api/generate`;

  const userPrompt =
    typeof prompt === 'string' && prompt.trim()
      ? prompt.trim()
      : `Generate a COMPLETE tailored website JSON array for this business. ` +
        `Write industry-specific sales copy (no generic placeholders). ` +
        `MUST include Navbar, Hero (with imageKeyword), Services/features (3–4 items each with imageKeyword), and Footer. ` +
        `Business description: ${safeDescription}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT_MS * 2);

  if (signal) {
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener('abort', () => controller.abort(), { once: true });
    }
  }

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: env.ollamaModel,
        prompt: userPrompt,
        system,
        stream: true,
        format: 'json',
        options: {
          temperature: 0.55,
          top_p: 0.9,
        },
      }),
      signal: controller.signal,
    });
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new AppError('Ollama stream timed out or was cancelled.', 504);
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
  }

  if (!response.ok) {
    clearTimeout(timeoutId);
    const detail = await safeReadBody(response);
    throw new AppError(
      `Ollama request failed (${response.status}). ${detail || 'Check that the model is pulled and Ollama is running.'}`,
      502,
    );
  }

  if (!response.body) {
    clearTimeout(timeoutId);
    throw new AppError('Ollama did not return a readable stream.', 502);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) {
          continue;
        }

        let payload;
        try {
          payload = JSON.parse(trimmed);
        } catch {
          continue;
        }

        const chunk =
          typeof payload?.response === 'string' ? payload.response : '';
        if (chunk) {
          fullText += chunk;
          if (typeof onChunk === 'function') {
            onChunk(chunk);
          }
        }
      }
    }

    if (buffer.trim()) {
      try {
        const payload = JSON.parse(buffer.trim());
        const chunk =
          typeof payload?.response === 'string' ? payload.response : '';
        if (chunk) {
          fullText += chunk;
          if (typeof onChunk === 'function') {
            onChunk(chunk);
          }
        }
      } catch {
        // ignore trailing partial JSON
      }
    }
  } finally {
    clearTimeout(timeoutId);
    try {
      reader.releaseLock();
    } catch {
      // ignore
    }
  }

  return {
    text: fullText,
    components: parseAndNormalizeWebsiteComponents(
      fullText,
      safeName,
      safeDescription,
    ),
  };
}

function sanitizeModelText(value) {
  let text = String(value).trim();
  text = text.replace(/^```[\w]*\s*/i, '').replace(/\s*```$/i, '').trim();

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
