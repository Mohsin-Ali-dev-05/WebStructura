import SectionWrapper from './SectionWrapper.jsx';
import { WS_BTN, WS_GRID, WS_H2, WS_SUB } from './designSystem.js';
import { listItemKey } from '../listKey.js';
import { sanitizeHref } from '../safeUrl.js';

/**
 * SaaS Pricing — responsive tier grid with featured highlight.
 */
export default function Pricing({
  heading = 'Pricing',
  subheading = 'Choose the plan that fits your team.',
  featuredTier = 'Pro',
  tiers = [],
}) {
  const safeTiers = Array.isArray(tiers) ? tiers : [];
  const featuredName = (featuredTier || 'Pro').toLowerCase();

  return (
    <SectionWrapper
      id="pricing"
      className="ws-section ws-pricing"
      aria-label="Pricing"
    >
      <header className="mb-6 md:mb-8 text-center md:text-left">
        <h2 className={`${WS_H2} mx-auto md:mx-0`}>{heading}</h2>
        {subheading ? (
          <p className={`${WS_SUB} mx-auto md:mx-0`}>{subheading}</p>
        ) : null}
      </header>

      {safeTiers.length === 0 ? (
        <p className="text-gray-500 text-lg">No pricing tiers yet.</p>
      ) : (
        <div className={WS_GRID}>
          {safeTiers.map((tier, index) => {
            const name = tier.name || `Plan ${index + 1}`;
            const isFeatured =
              tier.highlighted === true ||
              name.toLowerCase() === featuredName;
            const features = Array.isArray(tier.features) ? tier.features : [];

            return (
              <article
                key={listItemKey(tier, index, 'tier')}
                className={[
                  'relative flex flex-col gap-4 rounded-2xl border p-5 md:p-6 bg-white shadow-sm min-w-0 w-full',
                  isFeatured
                    ? 'border-emerald-600 shadow-lg ring-1 ring-emerald-600'
                    : 'border-gray-100',
                ].join(' ')}
              >
                {isFeatured ? (
                  <span className="inline-flex self-start rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    Most popular
                  </span>
                ) : null}
                <h3 className="text-xl font-bold tracking-tight text-gray-900">
                  {name}
                </h3>
                <p className="flex flex-wrap items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight text-gray-900">
                    {tier.price || '$0'}
                  </span>
                  {tier.period ? (
                    <span className="text-gray-500 text-sm">/{tier.period}</span>
                  ) : null}
                </p>
                {tier.description ? (
                  <p className="text-gray-500 text-base">{tier.description}</p>
                ) : null}
                <ul className="ws-pricing-features flex flex-col gap-3 flex-1 list-none m-0 p-0">
                  {features.map((feature, featureIndex) => (
                    <li
                      key={`${listItemKey(tier, index, 'tier')}-f-${featureIndex}`}
                      className="text-gray-600 text-sm"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
                {tier.ctaLabel ? (
                  <a
                    className={`${WS_BTN} mt-2`}
                    href={sanitizeHref(tier.ctaHref, '#contact')}
                  >
                    {tier.ctaLabel}
                  </a>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </SectionWrapper>
  );
}
