import { TEMPLATE_SEED } from './templateSeed.js';
import { createDefaultWebsiteData } from './schema.js';

/**
 * Starter templates for the Template Gallery.
 * Blank canvas + six industry seeds from templateSeed.js.
 */
export const PROJECT_TEMPLATES = [
  {
    id: 'blank',
    title: 'Blank Canvas',
    description:
      'A clean starter with Navbar, Hero, About, Contact, and Footer — ready for your content.',
    accent: 'blank',
    suggestedName: 'My Website',
    suggestedDescription: 'Started from the Blank Canvas template.',
    tags: ['Minimal', 'Flexible'],
    websiteData: createDefaultWebsiteData('My Website'),
  },
  ...TEMPLATE_SEED,
];

export function getTemplateById(id) {
  return PROJECT_TEMPLATES.find((template) => template.id === id) || null;
}
