/**
 * WebStructura Template Gallery seed data.
 * Six fully populated, industry-specific website layouts.
 *
 * Component types must match the renderer allowlist in schema.js:
 * Navbar, Hero, About, Skills, Services, Projects, Testimonials,
 * Pricing, FAQ, Gallery, CTA, Contact, Footer.
 *
 * Layout hints (layout, columns, image) are stored in props for
 * responsive React components to consume.
 */

/** Stable Unsplash CDN URLs (images.unsplash.com) with optimized sizing. */
const img = (photoId, w = 1200) =>
  `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=${w}&q=80`;

/**
 * @typedef {object} SeedTemplate
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} accent
 * @property {string} suggestedName
 * @property {string} suggestedDescription
 * @property {string[]} tags
 * @property {{ title: string, theme: object, components: object[] }} websiteData
 */

/** @type {SeedTemplate[]} */
export const TEMPLATE_SEED = [

  {
    "id": "saas-startup",
    "title": "SaaS Startup",
    "description": "Product-led landing page with pricing, feature grid, FAQ, and a strong trial CTA.",
    "accent": "startup",
    "suggestedName": "NovaFlow",
    "suggestedDescription": "B2B SaaS that turns engineering work into polished release notes your customers actually read.",
    "tags": [
      "SaaS",
      "Product",
      "Pricing"
    ],
    "websiteData": {
      "title": "NovaFlow",
      "theme": {
        "primaryColor": "#0f766e",
        "backgroundColor": "#f8fafc",
        "textColor": "#0f172a",
        "font": "Instrument Sans, system-ui, sans-serif"
      },
      "components": [
        {
          "type": "Navbar",
          "props": {
            "brand": "NovaFlow",
            "layout": "sticky-top",
            "links": [
              {
                "label": "Product",
                "href": "#about"
              },
              {
                "label": "Features",
                "href": "#services"
              },
              {
                "label": "Pricing",
                "href": "#pricing"
              },
              {
                "label": "FAQ",
                "href": "#faq"
              }
            ]
          }
        },
        {
          "type": "Hero",
          "props": {
            "title": "Release notes your customers finish reading",
            "subtitle": "NovaFlow turns pull requests into clear changelogs, in-app banners, and email digests — so product can ship updates without a dedicated content team.",
            "ctaLabel": "Start free trial",
            "ctaHref": "#pricing",
            "layout": "split",
            "image": "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80",
            "imageAlt": "Product team collaborating around a laptop in a bright office"
          }
        },
        {
          "type": "About",
          "props": {
            "heading": "Built for teams that ship every week",
            "body": "Connect GitHub, Linear, and Slack once. NovaFlow drafts customer-ready copy from merged work, keeps marketing in control of tone, and publishes everywhere your users already look — changelog, Intercom, and email.",
            "layout": "split-reverse",
            "image": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
            "imageAlt": "Cross-functional team workshopping product updates at a table"
          }
        },
        {
          "type": "Services",
          "props": {
            "heading": "Everything you need to announce with confidence",
            "layout": "feature-grid",
            "columns": 3,
            "items": [
              {
                "title": "Drafts from real commits",
                "description": "AI turns PRs into plain-language updates. Your team edits once, then ships the same story everywhere."
              },
              {
                "title": "Publish to every channel",
                "description": "Push one approved update to your changelog page, Slack, Intercom, and email digests in a single click."
              },
              {
                "title": "Audience-aware messaging",
                "description": "Show enterprise-only features to the right accounts without maintaining duplicate docs or fragile feature flags."
              }
            ]
          }
        },
        {
          "type": "Pricing",
          "props": {
            "heading": "Pricing that scales with release cadence",
            "subheading": "Start free. Upgrade when your team announces weekly.",
            "featuredTier": "Growth",
            "layout": "pricing-row",
            "columns": 3,
            "tiers": [
              {
                "name": "Starter",
                "price": "$0",
                "period": "mo",
                "description": "For indie founders shipping monthly.",
                "features": [
                  "1 product",
                  "Public changelog page",
                  "GitHub sync",
                  "Email support"
                ],
                "ctaLabel": "Get started",
                "ctaHref": "#contact"
              },
              {
                "name": "Growth",
                "price": "$49",
                "period": "mo",
                "description": "For product teams announcing weekly.",
                "features": [
                  "Unlimited drafts",
                  "Slack + Intercom",
                  "Audience segments",
                  "Priority support"
                ],
                "highlighted": true,
                "ctaLabel": "Start 14-day trial",
                "ctaHref": "#contact"
              },
              {
                "name": "Scale",
                "price": "$149",
                "period": "mo",
                "description": "For multi-product orgs with compliance needs.",
                "features": [
                  "SSO",
                  "Audit log",
                  "Custom domains",
                  "Dedicated CSM"
                ],
                "ctaLabel": "Talk to sales",
                "ctaHref": "#contact"
              }
            ]
          }
        },
        {
          "type": "FAQ",
          "props": {
            "heading": "Questions teams ask before they switch",
            "layout": "accordion",
            "columns": 1,
            "items": [
              {
                "question": "Will this replace our docs site?",
                "answer": "No. NovaFlow focuses on release communication. Embed it beside your docs with a lightweight widget — you keep the knowledge base you already trust."
              },
              {
                "question": "How long does setup take?",
                "answer": "Most teams connect GitHub and publish their first changelog in under 20 minutes. No design sprint required."
              },
              {
                "question": "Can we keep our brand voice?",
                "answer": "Yes. Train a style guide once; every draft follows your tone, length, and terminology rules before anyone hits publish."
              }
            ]
          }
        },
        {
          "type": "CTA",
          "props": {
            "heading": "Make your next release impossible to miss",
            "body": "Join 1,200 product teams who turned changelog busywork into a retention channel.",
            "ctaLabel": "Start free trial",
            "ctaHref": "#pricing",
            "secondaryLabel": "Book a demo",
            "secondaryHref": "#contact",
            "layout": "centered-banner"
          }
        },
        {
          "type": "Contact",
          "props": {
            "heading": "Talk with our team",
            "email": "hello@novaflow.example",
            "phone": "(415) 555-0142",
            "address": "San Francisco · Remote-first",
            "message": "Tell us about your release cadence — we reply within one business day.",
            "layout": "split"
          }
        },
        {
          "type": "Footer",
          "props": {
            "text": "© 2026 NovaFlow. Built with WebStructura.",
            "links": [
              {
                "label": "Product",
                "href": "#about"
              },
              {
                "label": "Pricing",
                "href": "#pricing"
              },
              {
                "label": "Contact",
                "href": "#contact"
              }
            ]
          }
        }
      ]
    }
  },
  {
    "id": "creative-portfolio",
    "title": "Creative Portfolio",
    "description": "Gallery-first portfolio for designers and photographers with projects, skills, and contact.",
    "accent": "portfolio",
    "suggestedName": "Maya Chen Studio",
    "suggestedDescription": "Independent brand designer and photographer crafting editorial identity systems for cultural brands.",
    "tags": [
      "Portfolio",
      "Creative",
      "Gallery"
    ],
    "websiteData": {
      "title": "Maya Chen Studio",
      "theme": {
        "primaryColor": "#1c1917",
        "backgroundColor": "#fafaf9",
        "textColor": "#1c1917",
        "font": "Fraunces, Georgia, serif"
      },
      "components": [
        {
          "type": "Navbar",
          "props": {
            "brand": "Maya Chen",
            "layout": "minimal",
            "links": [
              {
                "label": "Work",
                "href": "#gallery"
              },
              {
                "label": "Projects",
                "href": "#projects"
              },
              {
                "label": "About",
                "href": "#about"
              },
              {
                "label": "Contact",
                "href": "#contact"
              }
            ]
          }
        },
        {
          "type": "Gallery",
          "props": {
            "heading": "Selected work",
            "subheading": "Identity, editorial, and still-life collaborations from the last two seasons.",
            "layout": "masonry",
            "columns": 3,
            "images": [
              {
                "url": "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80",
                "alt": "Editorial portrait lit by soft window light"
              },
              {
                "url": "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80",
                "alt": "Brand identity mockups arranged on a studio desk"
              },
              {
                "url": "https://images.unsplash.com/photo-1452587925148-ce544e77e71c?auto=format&fit=crop&w=1200&q=80",
                "alt": "Film camera and prints on a dark tabletop"
              },
              {
                "url": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
                "alt": "Minimal architectural interior with natural light"
              },
              {
                "url": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80",
                "alt": "Fashion editorial detail with textured fabric"
              },
              {
                "url": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
                "alt": "Printed typography specimens and paper samples"
              }
            ]
          }
        },
        {
          "type": "Hero",
          "props": {
            "title": "Design that feels considered, never loud",
            "subtitle": "I partner with cultural brands and independent publishers to build visual systems that age well — type, photography, and print working as one craft.",
            "ctaLabel": "View selected projects",
            "ctaHref": "#projects",
            "layout": "split-reverse",
            "image": "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=1200&q=80",
            "imageAlt": "Designer workspace with sketches, prints, and coffee"
          }
        },
        {
          "type": "Projects",
          "props": {
            "heading": "Case studies",
            "layout": "card-grid",
            "columns": 2,
            "items": [
              {
                "title": "Northline Press",
                "description": "Complete rebrand for an independent literary magazine — wordmark, cover system, and searchable digital archive.",
                "link": "#gallery",
                "image": "https://images.unsplash.com/photo-1507842217343-583bb4010c80?auto=format&fit=crop&w=1200&q=80"
              },
              {
                "title": "Harbor Ceramics",
                "description": "Product photography and packaging system for a small-batch pottery studio launching nationwide retail.",
                "link": "#gallery",
                "image": "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80"
              },
              {
                "title": "Atlas Travel Journal",
                "description": "Editorial art direction for a 120-page travel annual spanning six cities and three photographers.",
                "link": "#gallery",
                "image": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80"
              },
              {
                "title": "Kinfolk Pop-up",
                "description": "Spatial graphics and invitation suite for a three-day design market in Portland.",
                "link": "#gallery",
                "image": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80"
              }
            ]
          }
        },
        {
          "type": "Skills",
          "props": {
            "heading": "Capabilities",
            "layout": "pill-row",
            "columns": 3,
            "items": [
              {
                "name": "Brand identity",
                "level": "Expert"
              },
              {
                "name": "Editorial design",
                "level": "Expert"
              },
              {
                "name": "Art direction",
                "level": "Advanced"
              },
              {
                "name": "Product photography",
                "level": "Advanced"
              },
              {
                "name": "Typography systems",
                "level": "Expert"
              },
              {
                "name": "Print production",
                "level": "Advanced"
              }
            ]
          }
        },
        {
          "type": "About",
          "props": {
            "heading": "About Maya",
            "body": "Based in Brooklyn, I spent seven years inside editorial studios before opening my practice in 2019. Clients include independent publishers, hospitality groups, and product makers who care about craft as much as conversion.",
            "layout": "split",
            "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80",
            "imageAlt": "Portrait of a creative director in a bright studio"
          }
        },
        {
          "type": "Testimonials",
          "props": {
            "heading": "Client notes",
            "layout": "quote-stack",
            "columns": 1,
            "items": [
              {
                "quote": "Maya gave our magazine a spine — every issue now feels part of the same family without looking repetitive.",
                "author": "Elena Voss",
                "role": "Editor-in-Chief, Northline Press"
              },
              {
                "quote": "The photography and packaging landed us three new wholesale accounts in the first month.",
                "author": "Jordan Hale",
                "role": "Founder, Harbor Ceramics"
              }
            ]
          }
        },
        {
          "type": "Contact",
          "props": {
            "heading": "Start a project",
            "email": "studio@mayachen.example",
            "phone": "(718) 555-0199",
            "address": "Brooklyn, NY · By appointment",
            "message": "Share your timeline, budget range, and a few references you love. I reply within two business days.",
            "layout": "centered"
          }
        },
        {
          "type": "Footer",
          "props": {
            "text": "© 2026 Maya Chen Studio. All rights reserved.",
            "links": [
              {
                "label": "Work",
                "href": "#gallery"
              },
              {
                "label": "Contact",
                "href": "#contact"
              }
            ]
          }
        }
      ]
    }
  },
  {
    "id": "modern-cafeteria",
    "title": "Modern Cafeteria",
    "description": "Warm hospitality site with menu highlights, gallery, hours, and reservation-ready contact.",
    "accent": "cafeteria",
    "suggestedName": "Cedar & Steam",
    "suggestedDescription": "Neighborhood cafeteria serving seasonal bowls, house bread, and specialty coffee from an open kitchen.",
    "tags": [
      "Hospitality",
      "Food",
      "Local"
    ],
    "websiteData": {
      "title": "Cedar & Steam",
      "theme": {
        "primaryColor": "#b45309",
        "backgroundColor": "#fffbeb",
        "textColor": "#292524",
        "font": "Source Serif 4, Georgia, serif"
      },
      "components": [
        {
          "type": "Navbar",
          "props": {
            "brand": "Cedar & Steam",
            "layout": "sticky-top",
            "links": [
              {
                "label": "Menu",
                "href": "#services"
              },
              {
                "label": "Gallery",
                "href": "#gallery"
              },
              {
                "label": "Visit",
                "href": "#about"
              },
              {
                "label": "Reserve",
                "href": "#contact"
              }
            ]
          }
        },
        {
          "type": "Hero",
          "props": {
            "title": "Seasonal bowls from an open kitchen",
            "subtitle": "Cedar & Steam is an all-day cafeteria in the Arts District — wood-fired grains, market vegetables, and coffee roasted two blocks away.",
            "ctaLabel": "See today’s menu",
            "ctaHref": "#services",
            "layout": "split",
            "image": "https://images.unsplash.com/photo-1517248135467-4c7edad6c643?auto=format&fit=crop&w=1200&q=80",
            "imageAlt": "Warm restaurant interior with communal wooden tables"
          }
        },
        {
          "type": "Gallery",
          "props": {
            "heading": "From the pass",
            "subheading": "Morning service through late lunch — plated in the open kitchen.",
            "layout": "image-row",
            "columns": 3,
            "images": [
              {
                "url": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
                "alt": "Freshly poured latte with clean foam art"
              },
              {
                "url": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80",
                "alt": "Brunch plate with eggs, greens, and toasted bread"
              },
              {
                "url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
                "alt": "Freshly baked sourdough loaves on a wooden board"
              },
              {
                "url": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
                "alt": "Colorful market vegetable salad in a ceramic bowl"
              },
              {
                "url": "https://images.unsplash.com/photo-1559339352-11d035aa6de6?auto=format&fit=crop&w=1200&q=80",
                "alt": "Sunlit cafeteria dining room with counter seating"
              },
              {
                "url": "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80",
                "alt": "Seasonal pastry dusted with powdered sugar"
              }
            ]
          }
        },
        {
          "type": "Services",
          "props": {
            "heading": "Menu highlights",
            "layout": "feature-grid",
            "columns": 3,
            "items": [
              {
                "title": "Cedar grain bowl",
                "description": "Farro, roasted squash, pickled onion, herb yogurt, and chili oil — available all day, customized for dietary needs."
              },
              {
                "title": "Steam sandwich",
                "description": "House focaccia, slow-cooked mushrooms, fontina, and arugula. Add a soft egg until 2pm."
              },
              {
                "title": "Market rotation",
                "description": "A daily special built from whatever the farmers market brings before we open the doors."
              }
            ]
          }
        },
        {
          "type": "About",
          "props": {
            "heading": "Come as you are",
            "body": "We designed Cedar & Steam for solo breakfasts, laptop lunches, and long weekend tables. Counter seating faces the kitchen; the back room holds groups of eight. Kids menus and dietary swaps are always available — just ask.",
            "layout": "split-reverse",
            "image": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
            "imageAlt": "Plated seasonal dish served in a bright dining room"
          }
        },
        {
          "type": "Testimonials",
          "props": {
            "heading": "What neighbors say",
            "layout": "quote-row",
            "columns": 2,
            "items": [
              {
                "quote": "Best weekday lunch within walking distance of the studio. The grain bowl never gets boring.",
                "author": "Priya N.",
                "role": "Regular · Arts District"
              },
              {
                "quote": "We hosted a team offsite in the back room — service was warm and the coffee never ran out.",
                "author": "Marcus T.",
                "role": "Studio lead"
              }
            ]
          }
        },
        {
          "type": "CTA",
          "props": {
            "heading": "Reserve a table or order ahead",
            "body": "Walk-ins welcome until 3pm. Groups of six or more can book the back room online.",
            "ctaLabel": "Book a table",
            "ctaHref": "#contact",
            "secondaryLabel": "View full menu",
            "secondaryHref": "#services",
            "layout": "centered-banner"
          }
        },
        {
          "type": "Contact",
          "props": {
            "heading": "Visit us",
            "email": "hello@cedarandsteam.example",
            "phone": "(213) 555-0177",
            "address": "418 Mateo St, Los Angeles, CA · Open daily 7am–4pm",
            "message": "For catering or private events, email us with your date and headcount.",
            "layout": "split"
          }
        },
        {
          "type": "Footer",
          "props": {
            "text": "© 2026 Cedar & Steam. Eat well, stay awhile.",
            "links": [
              {
                "label": "Menu",
                "href": "#services"
              },
              {
                "label": "Reserve",
                "href": "#contact"
              }
            ]
          }
        }
      ]
    }
  }
  ,
  // ── 4. E-Commerce Storefront ─────────────────────────────────────
  {
    id: 'ecommerce-storefront',
    title: 'E-Commerce Storefront',
    description:
      'Product-forward shop layout with featured collections, testimonials, and clear purchase CTAs.',
    accent: 'commerce',
    suggestedName: 'Trailform Supply',
    suggestedDescription:
      'Direct-to-consumer outdoor brand selling durable daypacks, layers, and trail accessories.',
    tags: ['E-Commerce', 'Retail', 'Product'],
    websiteData: {
      title: 'Trailform Supply',
      theme: {
        primaryColor: '#166534',
        backgroundColor: '#f7fee7',
        textColor: '#14532d',
        font: 'DM Sans, system-ui, sans-serif',
      },
      components: [
        {
          type: 'Navbar',
          props: {
            brand: 'Trailform',
            layout: 'sticky-top',
            links: [
              { label: 'Shop', href: '#projects' },
              { label: 'Why Trailform', href: '#about' },
              { label: 'Reviews', href: '#testimonials' },
              { label: 'Support', href: '#faq' },
            ],
          },
        },
        {
          type: 'Hero',
          props: {
            title: 'Gear built for real miles, not store shelves',
            subtitle:
              'Trailform designs daypacks and layers that survive weekend summits and daily commutes — tested on trail, shipped to your door.',
            ctaLabel: 'Shop the Spring drop',
            ctaHref: '#projects',
            layout: 'split',
            image: img('1551632811-561732d1e306'),
            imageAlt: 'Hiker wearing a daypack on a mountain trail',
          },
        },
        {
          type: 'Projects',
          props: {
            heading: 'Featured products',
            layout: 'product-grid',
            columns: 3,
            items: [
              {
                title: 'Ridge 22 Daypack — $148',
                description:
                  'Weatherproof 22L pack with laptop sleeve, hydration port, and silent zippers for early starts.',
                link: '#contact',
                image: img('1553062407-98eeb64c6a62'),
              },
              {
                title: 'Alpine Merino Crew — $78',
                description:
                  'Midweight merino that regulates on climbs and still looks sharp under a city jacket.',
                link: '#contact',
                image: img('1523381210434-271e8be1f52b'),
              },
              {
                title: 'Switchback Cap — $36',
                description:
                  'Structured brim, recycled shell, and a clip loop that survives bushwhacks.',
                link: '#contact',
                image: img('1514327605112-b887c0e61c0a'),
              },
            ],
          },
        },
        {
          type: 'Services',
          props: {
            heading: 'Why shoppers stay with Trailform',
            layout: 'feature-grid',
            columns: 3,
            items: [
              {
                title: 'Free exchanges for 60 days',
                description:
                  'Wrong size or second thoughts? Ship it back prepaid — we restock and resend fast.',
              },
              {
                title: 'Repair, don’t replace',
                description:
                  'Lifetime stitch repair on packs. Bring it in or mail it; we keep gear on the trail longer.',
              },
              {
                title: 'Carbon-aware shipping',
                description:
                  'Orders consolidate weekly from our Portland warehouse with offsets included at checkout.',
              },
            ],
          },
        },
        {
          type: 'Gallery',
          props: {
            heading: 'Field notes',
            subheading: 'Customer trips from the Cascades to the Catskills.',
            layout: 'image-row',
            columns: 4,
            images: [
              {
                url: img('1464822759023-fed622ff2c3b'),
                alt: 'Mountain trail at sunrise',
              },
              {
                url: img('1504851149312-7a075b496cc7'),
                alt: 'Camp setup with packs',
              },
              {
                url: img('1441974231531-c6227db76b6e'),
                alt: 'Forest hiking path',
              },
              {
                url: img('1501785888041-af3ef285b470'),
                alt: 'Alpine lake overlook',
              },
            ],
          },
        },
        {
          type: 'Testimonials',
          props: {
            heading: 'From the trail community',
            layout: 'quote-row',
            columns: 2,
            items: [
              {
                quote:
                  'The Ridge 22 survived a week on the Wonderland Trail and still looks new. Zippers never snagged once.',
                author: 'Chris Alvarez',
                role: 'Thru-hiker · WA',
              },
              {
                quote:
                  'Finally a merino crew that doesn’t pill after three washes. I own three colors now.',
                author: 'Sam Okonkwo',
                role: 'Weekend climber',
              },
            ],
          },
        },
        {
          type: 'FAQ',
          props: {
            heading: 'Shipping & sizing',
            layout: 'accordion',
            columns: 1,
            items: [
              {
                question: 'How fast do orders ship?',
                answer:
                  'In-stock items leave Portland within two business days. You’ll get tracking the moment the label prints.',
              },
              {
                question: 'Do you ship internationally?',
                answer:
                  'Yes — Canada and EU at checkout. Duties are calculated upfront so there are no surprises.',
              },
              {
                question: 'How do I find my pack size?',
                answer:
                  'Use our torso-length guide in the product page. Still unsure? Email a selfie with a measuring tape — we’ll recommend a size.',
              },
            ],
          },
        },
        {
          type: 'CTA',
          props: {
            heading: 'Ready for your next trail day?',
            body: 'Free shipping over $100. New customers get 10% off with code FIRSTTRAIL.',
            ctaLabel: 'Shop all products',
            ctaHref: '#projects',
            secondaryLabel: 'Contact support',
            secondaryHref: '#contact',
            layout: 'centered-banner',
          },
        },
        {
          type: 'Contact',
          props: {
            heading: 'Customer support',
            email: 'support@trailform.example',
            phone: '(503) 555-0164',
            address: 'Portland, OR · Mon–Fri 9am–5pm PT',
            message: 'Order questions, repairs, or wholesale — we respond within one business day.',
            layout: 'split',
          },
        },
        {
          type: 'Footer',
          props: {
            text: '© 2026 Trailform Supply. Built for the long way around.',
            links: [
              { label: 'Shop', href: '#projects' },
              { label: 'FAQ', href: '#faq' },
              { label: 'Support', href: '#contact' },
            ],
          },
        },
      ],
    },
  },

  // ── 5. Real Estate ───────────────────────────────────────────────
  {
    id: 'real-estate',
    title: 'Real Estate',
    description:
      'Property showcase with featured listings, agent credibility, and inquiry-ready contact.',
    accent: 'estate',
    suggestedName: 'Harborline Realty',
    suggestedDescription:
      'Boutique residential brokerage specializing in waterfront and historic homes across the Mid-Atlantic.',
    tags: ['Real Estate', 'Listings', 'Local'],
    websiteData: {
      title: 'Harborline Realty',
      theme: {
        primaryColor: '#1e3a5f',
        backgroundColor: '#f8fafc',
        textColor: '#0f172a',
        font: 'Libre Franklin, system-ui, sans-serif',
      },
      components: [
        {
          type: 'Navbar',
          props: {
            brand: 'Harborline',
            layout: 'sticky-top',
            links: [
              { label: 'Listings', href: '#projects' },
              { label: 'Neighborhoods', href: '#gallery' },
              { label: 'Our approach', href: '#about' },
              { label: 'Contact', href: '#contact' },
            ],
          },
        },
        {
          type: 'Hero',
          props: {
            title: 'Homes with a sense of place along the water',
            subtitle:
              'Harborline represents buyers and sellers of coastal, historic, and architect-designed residences from Annapolis to Cape May.',
            ctaLabel: 'Browse open listings',
            ctaHref: '#projects',
            layout: 'split-reverse',
            image: img('1600596542815-ffad4c1539a9'),
            imageAlt: 'Modern waterfront home at dusk',
          },
        },
        {
          type: 'Projects',
          props: {
            heading: 'Featured listings',
            layout: 'listing-grid',
            columns: 3,
            items: [
              {
                title: '14 Pier Street — $1.85M',
                description:
                  '4 bed · 3.5 bath · 3,200 sq ft. Renovated 1920s colonial with deep-water dock and private slip.',
                link: '#contact',
                image: img('1564013799919-ab600027ffc6'),
              },
              {
                title: 'The Mill House — $965K',
                description:
                  '3 bed · 2 bath · 2,100 sq ft. Converted mill with soaring ceilings, chef’s kitchen, and garden courtyard.',
                link: '#contact',
                image: img('1600585154340-be6161a56a0c'),
              },
              {
                title: 'Cedar Bluff Cottage — $625K',
                description:
                  '2 bed · 2 bath · 1,450 sq ft. Light-filled bungalow two blocks from the marina boardwalk.',
                link: '#contact',
                image: img('1570129477492-45c003edd2be'),
              },
            ],
          },
        },
        {
          type: 'Gallery',
          props: {
            heading: 'Neighborhoods we know deeply',
            subheading: 'From quiet coves to downtown walkups — local insight on every showing.',
            layout: 'image-row',
            columns: 3,
            images: [
              {
                url: img('1500530855697-b586d89ba3ee'),
                alt: 'Harbor marina at golden hour',
              },
              {
                url: img('1449824913935-59a10b8d2000'),
                alt: 'Tree-lined historic street',
              },
              {
                url: img('1507525428034-b723cf961d3e'),
                alt: 'Coastal boardwalk neighborhood',
              },
            ],
          },
        },
        {
          type: 'About',
          props: {
            heading: 'A brokerage that still shows up in person',
            body: 'Harborline was founded by agents who grew up sailing these waters. We limit active listings so every seller gets a marketing plan, professional photography, and weekly feedback — not a portal listing left on autopilot.',
            layout: 'split',
            image: img('1560518883-ce09059eeffa'),
            imageAlt: 'Real estate agent presenting keys at a closing',
          },
        },
        {
          type: 'Services',
          props: {
            heading: 'How we work with you',
            layout: 'feature-grid',
            columns: 3,
            items: [
              {
                title: 'Buyer representation',
                description:
                  'Off-market intros, inspection advocacy, and negotiation that protects your timeline.',
              },
              {
                title: 'Seller strategy',
                description:
                  'Pricing models, staging partners, and launch weekends designed for competitive offers.',
              },
              {
                title: 'Relocation concierge',
                description:
                  'School tours, contractor intros, and temporary housing for clients moving from out of state.',
              },
            ],
          },
        },
        {
          type: 'Testimonials',
          props: {
            heading: 'Recent closings',
            layout: 'quote-stack',
            columns: 1,
            items: [
              {
                quote:
                  'They found us a dock-ready home before it hit the MLS and guided us through a complex flood-zone review without drama.',
                author: 'The Ellison family',
                role: 'Buyers · Pier Street',
              },
              {
                quote:
                  'We had three offers over asking in nine days. The photography and open-house plan made the difference.',
                author: 'Diane K.',
                role: 'Seller · Mill House',
              },
            ],
          },
        },
        {
          type: 'CTA',
          props: {
            heading: 'Thinking about a move this season?',
            body: 'Book a complimentary valuation or a private buyer consult — no pressure, just local numbers.',
            ctaLabel: 'Request a consultation',
            ctaHref: '#contact',
            secondaryLabel: 'View listings',
            secondaryHref: '#projects',
            layout: 'centered-banner',
          },
        },
        {
          type: 'Contact',
          props: {
            heading: 'Talk with an agent',
            email: 'hello@harborline.example',
            phone: '(410) 555-0138',
            address: '22 Dock Street, Annapolis, MD 21401',
            message:
              'Share your timeline, budget, and preferred neighborhoods. An agent responds within one business day.',
            layout: 'split',
          },
        },
        {
          type: 'Footer',
          props: {
            text: '© 2026 Harborline Realty. Equal housing opportunity.',
            links: [
              { label: 'Listings', href: '#projects' },
              { label: 'Contact', href: '#contact' },
            ],
          },
        },
      ],
    },
  },

  // ── 6. Tech Blog ─────────────────────────────────────────────────
  {
    id: 'tech-blog',
    title: 'Tech Blog',
    description:
      'Editorial layout for an engineering blog with featured posts, topics, about, and subscribe CTA.',
    accent: 'blog',
    suggestedName: 'Signal Path',
    suggestedDescription:
      'Independent engineering blog covering distributed systems, developer experience, and pragmatic architecture.',
    tags: ['Blog', 'Tech', 'Editorial'],
    websiteData: {
      title: 'Signal Path',
      theme: {
        primaryColor: '#4f46e5',
        backgroundColor: '#eef2ff',
        textColor: '#1e1b4b',
        font: 'IBM Plex Sans, system-ui, sans-serif',
      },
      components: [
        {
          type: 'Navbar',
          props: {
            brand: 'Signal Path',
            layout: 'minimal',
            links: [
              { label: 'Articles', href: '#projects' },
              { label: 'Topics', href: '#services' },
              { label: 'About', href: '#about' },
              { label: 'Subscribe', href: '#cta' },
            ],
          },
        },
        {
          type: 'Hero',
          props: {
            title: 'Practical notes on building software that lasts',
            subtitle:
              'Signal Path is a weekly engineering journal — deep dives on systems design, DX tooling, and the trade-offs teams actually make in production.',
            ctaLabel: 'Read the latest issue',
            ctaHref: '#projects',
            layout: 'split',
            image: img('1498050108023-c5249f4df085'),
            imageAlt: 'Developer workspace with dual monitors',
          },
        },
        {
          type: 'Projects',
          props: {
            heading: 'Featured articles',
            layout: 'article-list',
            columns: 1,
            items: [
              {
                title: 'How we cut p99 latency 40% without a rewrite',
                description:
                  'A case study on connection pooling, cache locality, and the measurement mistakes that hid the real bottleneck for months.',
                link: '#contact',
                image: img('1558494949-ef010cbdcc31'),
              },
              {
                title: 'DX checklists that engineers actually follow',
                description:
                  'What belongs in an onboarding doc versus a living runbook — and how to keep both from rotting.',
                link: '#contact',
                image: img('1461749280684-dccba630e2f6'),
              },
              {
                title: 'Event-driven systems without the ceremony',
                description:
                  'When a simple queue beats Kafka, and when you will regret skipping schema evolution on day one.',
                link: '#contact',
                image: img('1451187580459-43490279c0fa'),
              },
            ],
          },
        },
        {
          type: 'Services',
          props: {
            heading: 'Topics we cover',
            layout: 'feature-grid',
            columns: 3,
            items: [
              {
                title: 'Distributed systems',
                description:
                  'Consistency models, failure modes, and operational playbooks written for the on-call engineer.',
              },
              {
                title: 'Developer experience',
                description:
                  'CI speed, local environments, and internal platforms that reduce toil without becoming a second product.',
              },
              {
                title: 'Architecture trade-offs',
                description:
                  'Honest comparisons — monolith vs services, sync vs async — with costs spelled out in people-hours.',
              },
            ],
          },
        },
        {
          type: 'Gallery',
          props: {
            heading: 'From the notebook',
            subheading: 'Diagrams, desk setups, and conference sketches.',
            layout: 'image-row',
            columns: 3,
            images: [
              {
                url: img('1552664730-d307ca884978'),
                alt: 'Architecture diagram on a whiteboard',
              },
              {
                url: img('1540575467063-178a50c2df87'),
                alt: 'Engineering conference keynote stage',
              },
              {
                url: img('1517336714731-489689fd1ca8'),
                alt: 'Minimal coding desk setup',
              },
            ],
          },
        },
        {
          type: 'About',
          props: {
            heading: 'Who writes Signal Path',
            body: 'Edited by practicing staff engineers. We publish one long-form essay every Tuesday and occasional interviews with teams who open-sourced the hard parts of their stack. No vendor pitches — just field notes.',
            layout: 'split-reverse',
            image: img('1488190211105-8b0e65b80b4e'),
            imageAlt: 'Writer reviewing notes at a desk',
          },
        },
        {
          type: 'Skills',
          props: {
            heading: 'Series & formats',
            layout: 'pill-row',
            columns: 3,
            items: [
              { name: 'Deep dives', level: 'Weekly' },
              { name: 'Postmortems', level: 'Monthly' },
              { name: 'Tooling reviews', level: 'Biweekly' },
              { name: 'AMA transcripts', level: 'Quarterly' },
              { name: 'Reading lists', level: 'Monthly' },
              { name: 'Guest essays', level: 'Occasional' },
            ],
          },
        },
        {
          type: 'CTA',
          props: {
            heading: 'Get the Tuesday essay in your inbox',
            body: 'One thoughtful article, zero spam. Unsubscribe anytime — we keep the list under 40k on purpose.',
            ctaLabel: 'Subscribe free',
            ctaHref: '#contact',
            secondaryLabel: 'Browse the archive',
            secondaryHref: '#projects',
            layout: 'centered-banner',
          },
        },
        {
          type: 'FAQ',
          props: {
            heading: 'For readers & guests',
            layout: 'accordion',
            columns: 1,
            items: [
              {
                question: 'Can I republish an article?',
                answer:
                  'Yes with attribution and a canonical link back to Signal Path. Email us for the full reuse policy.',
              },
              {
                question: 'Do you take guest posts?',
                answer:
                  'Occasionally. Pitch a 200-word outline focused on a production lesson — no “AI will change everything” thinkpieces.',
              },
              {
                question: 'Is there an RSS feed?',
                answer:
                  'Yes — /rss.xml on the live site. Newsletter subscribers also get exclusive diagrams not published on the web.',
              },
            ],
          },
        },
        {
          type: 'Contact',
          props: {
            heading: 'Write to the editors',
            email: 'editors@signalpath.example',
            phone: '',
            address: 'Remote · Published every Tuesday',
            message:
              'Corrections, guest pitches, and sponsorship inquiries all land in the same inbox.',
            layout: 'centered',
          },
        },
        {
          type: 'Footer',
          props: {
            text: '© 2026 Signal Path. Independent engineering journalism.',
            links: [
              { label: 'Articles', href: '#projects' },
              { label: 'Subscribe', href: '#cta' },
              { label: 'Contact', href: '#contact' },
            ],
          },
        },
      ],
    },
  },
];

export function getSeedTemplateById(id) {
  return TEMPLATE_SEED.find((template) => template.id === id) || null;
}

export default TEMPLATE_SEED;
