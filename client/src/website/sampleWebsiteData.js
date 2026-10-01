/**
 * Manual sample used to verify the live preview without AI.
 * Safe JSON only — props map to whitelisted React components.
 */
export const MANUAL_SAMPLE_WEBSITE_DATA = {
  title: "Northside Bakery",
  theme: {
    primaryColor: "#b45309",
    backgroundColor: "#fffaf5",
    textColor: "#1c1917",
    font: 'Georgia, "Times New Roman", serif',
  },
  components: [
    {
      id: "sample-navbar",
      type: "Navbar",
      props: {
        brand: "Northside Bakery",
        links: [
          { label: "About", href: "#about" },
          { label: "Services", href: "#services" },
          { label: "Contact", href: "#contact" },
        ],
      },
    },
    {
      id: "sample-hero",
      type: "Hero",
      props: {
        title: "Fresh bread every morning",
        subtitle:
          "Neighborhood bakery serving sourdough, pastries, and coffee.",
        ctaLabel: "Visit us",
        ctaHref: "#contact",
      },
    },
    {
      id: "sample-about",
      type: "About",
      props: {
        heading: "About",
        body: "We bake in small batches using local flour and traditional methods.",
      },
    },
    {
      id: "sample-services",
      type: "Services",
      props: {
        heading: "What we offer",
        items: [
          {
            title: "Artisan loaves",
            description: "Sourdough, rye, and seasonal specialty breads.",
          },
          {
            title: "Pastries",
            description: "Croissants, cinnamon rolls, and weekend tarts.",
          },
        ],
      },
    },
    {
      id: "sample-contact",
      type: "Contact",
      props: {
        heading: "Visit the shop",
        email: "hello@northsidebakery.example",
        phone: "(555) 014-2200",
        address: "18 Maple Street",
        message: "Open Tuesday–Sunday, 7am–3pm.",
      },
    },
    {
      id: "sample-footer",
      type: "Footer",
      props: {
        text: "© Northside Bakery. Baked with care.",
        columns: [
          {
            title: "Product",
            links: [
              { label: "Menu", href: "#services" },
              { label: "About", href: "#about" },
            ],
          },
          {
            title: "Visit",
            links: [
              { label: "Contact", href: "#contact" },
              { label: "Hours", href: "#contact" },
            ],
          },
          {
            title: "Company",
            links: [
              { label: "Our Story", href: "#about" },
              { label: "Location", href: "#contact" },
            ],
          },
        ],
      },
    },
  ],
};
