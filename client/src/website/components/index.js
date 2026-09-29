import About from './About.jsx';
import Contact from './Contact.jsx';
import CTA from './CTA.jsx';
import FAQ from './FAQ.jsx';
import Footer from './Footer.jsx';
import Gallery from './Gallery.jsx';
import Hero from './Hero.jsx';
import Navbar from './Navbar.jsx';
import Pricing from './Pricing.jsx';
import Projects from './Projects.jsx';
import Services from './Services.jsx';
import Skills from './Skills.jsx';
import Testimonials from './Testimonials.jsx';

/**
 * Whitelist map: schema type → React component.
 * Unknown types are ignored by the renderer.
 */
export const COMPONENT_MAP = {
  Navbar,
  Hero,
  About,
  Skills,
  Services,
  Projects,
  Testimonials,
  Pricing,
  FAQ,
  Gallery,
  CTA,
  Contact,
  Footer,
};
