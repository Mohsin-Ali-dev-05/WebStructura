/**
 * Map AI imageKeyword tags → stable Unsplash CDN photo IDs.
 * LoremFlickr was unreliable (broken/blocked images); curated IDs always load.
 */

const UNSplash = (photoId, w = 1200) =>
  `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=${w}&q=80`;

/** Curated topic → photo ID pools (real Unsplash photos). */
export const TOPIC_PHOTO_IDS = {
  cafeteria: [
    '1517248135467-4c7edad6c643',
    '1554118811-1e0d58224f24',
    '1414235077428-338989a2e8c0',
    '1495474472287-4d71bcdd2085',
  ],
  food: [
    '1490645935967-10de6ba17061',
    '1509440159596-0249088772ff',
    '1512621776951-a57141f2eefd',
    '1488477181946-6428a0291777',
  ],
  restaurant: [
    '1517248135467-4c7edad6c643',
    '1559339352-11d035aa6de6',
    '1414235077428-338989a2e8c0',
  ],
  coffee: ['1495474472287-4d71bcdd2085', '1509042239256-d81666798999'],
  bakery: ['1509440159596-0249088772ff', '1488477181946-6428a0291777'],
  realestate: [
    '1600596542815-ffad4c1539a9',
    '1564013799919-ab600027ffc6',
    '1600585154340-be6161a56a0c',
    '1560518883-ce09059eeffa',
  ],
  house: [
    '1600596542815-ffad4c1539a9',
    '1570129477492-45c003edd2be',
    '1600585154340-be6161a56a0c',
  ],
  property: ['1564013799919-ab600027ffc6', '1560518883-ce09059eeffa'],
  shopping: [
    '1472851294608-062f824d29cc',
    '1553062407-98eeb64c6a62',
    '1523381210434-271e8be1f52b',
  ],
  retail: ['1551632811-561732d1e306', '1514327605112-b887c0e61c0a'],
  ecommerce: ['1472851294608-062f824d29cc', '1553062407-98eeb64c6a62'],
  technology: [
    '1460925895917-afdab827c52f',
    '1551434678-e076c223a692',
    '1498050108023-c5249f4df085',
    '1516110833967-0b5716ca1387',
  ],
  saas: [
    '1460925895917-afdab827c52f',
    '1551434678-e076c223a692',
    '1522071820081-009f0129c71c',
  ],
  office: [
    '1497366216548-37526070297c',
    '1522071820081-009f0129c71c',
    '1556761175-5973dc0f32e7',
  ],
  dashboard: ['1460925895917-afdab827c52f', '1551281041-64b60f63ad5f'],
  software: ['1498050108023-c5249f4df085', '1461749280684-dccba630e2f6'],
  portfolio: [
    '1618005182384-a83a8bd57fbe',
    '1492691527719-9d1e07e534b4',
    '1561070791-2526d30994b5',
  ],
  design: [
    '1561070791-2526d30994b5',
    '1586717791821-3f44a563fa4c',
    '1452587925148-ce544e77e71c',
  ],
  creative: ['1492691527719-9d1e07e534b4', '1618005182384-a83a8bd57fbe'],
  photography: [
    '1452587925148-ce544e77e71c',
    '1492691527719-9d1e07e534b4',
    '1469334031218-e382a71b716b',
  ],
  blog: [
    '1499750310107-5fef28a66643',
    '1488190211105-8b0e65b80b4e',
    '1434030216411-0b793f4b4173',
  ],
  writing: ['1488190211105-8b0e65b80b4e', '1455390582262-044cdead168c'],
  laptop: ['1498050108023-c5249f4df085', '1516321318423-f06f85e504b3'],
  fitness: [
    '1517836353435-10d9dd129ffa',
    '1571019614242-c5c5dee9f50b',
    '1534438327276-14e5300c3a48',
  ],
  gym: ['1534438327276-14e5300c3a48', '1517836353435-10d9dd129ffa'],
  health: ['1571019614242-c5c5dee9f50b', '1506126613408-eca07ce68773'],
  education: [
    '1503676260728-1c00da094a0b',
    '1523240795612-9a054b0db644',
    '1427505516984-b77b5f5a5b5a',
  ],
  school: ['1503676260728-1c00da094a0b', '1523240795612-9a054b0db644'],
  finance: [
    '1554224155-6726b3ff858f',
    '1611974789855-9c2a0a7236a3',
    '1460925895917-afdab827c52f',
  ],
  hotel: [
    '1566073771259-6a8506099945',
    '1551882547-ff40c63fe5fa',
    '1520250497591-112f2f40a3f4',
  ],
  travel: [
    '1488646953014-85cb44e25828',
    '1476514525532-e69fdabe86bf',
    '1507525428034-b723cf961d3e',
  ],
  medical: [
    '1576091160399-112ba8d25d1d',
    '1519494026892-80bbd2d6fd0d',
    '1581594693702-fbdc51b2763b',
  ],
  law: [
    '1589829545856-d10d557cf95f',
    '1450101499163-c8848c66ca85',
  ],
  marketing: [
    '1557804506-669a67965ba0',
    '1460925895917-afdab827c52f',
    '1556761175-5973dc0f32e7',
  ],
  analytics: ['1551281041-64b60f63ad5f', '1460925895917-afdab827c52f'],
  team: ['1522071820081-009f0129c71c', '1556761175-5973dc0f32e7'],
  business: [
    '1497366216548-37526070297c',
    '1522071820081-009f0129c71c',
    '1557804506-669a67965ba0',
    '1460925895917-afdab827c52f',
  ],
};

const ALIAS_TO_TOPIC = [
  [/cafeteria|canteen|dining|cafe/, 'cafeteria'],
  [/restaurant|bistro|kitchen|chef/, 'restaurant'],
  [/bakery|bread|pastry/, 'bakery'],
  [/coffee|espresso/, 'coffee'],
  [/food|meal|menu|cater/, 'food'],
  [/real.?estate|realty|broker/, 'realestate'],
  [/house|home|housing|apartment|villa/, 'house'],
  [/property|listing/, 'property'],
  [/e-?commerce|storefront|shopify/, 'ecommerce'],
  [/shop|store|retail|product/, 'shopping'],
  [/saas|software|platform|app/, 'saas'],
  [/dashboard|analytics|metrics/, 'dashboard'],
  [/tech|software|coding|developer/, 'technology'],
  [/office|workspace|cowork/, 'office'],
  [/portfolio|studio|agency/, 'portfolio'],
  [/design|brand|creative/, 'design'],
  [/photo|camera|gallery/, 'photography'],
  [/blog|news|media|content|writer/, 'blog'],
  [/fitness|gym|workout|yoga/, 'fitness'],
  [/health|wellness|spa/, 'health'],
  [/education|school|course|learn|tutor|university/, 'education'],
  [/finance|bank|fintech|accounting|invest/, 'finance'],
  [/hotel|resort|hospitality/, 'hotel'],
  [/travel|tourism|vacation/, 'travel'],
  [/medical|clinic|doctor|hospital/, 'medical'],
  [/law|legal|attorney|lawyer/, 'law'],
  [/market|ads|growth|seo/, 'marketing'],
  [/team|people|staff|collaborat/, 'team'],
];

function hashString(value) {
  let hash = 0;
  const str = String(value || '');
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function resolveTopicKey(keyword = '') {
  const cleaned = String(keyword || '')
    .toLowerCase()
    .replace(/[^a-z0-9,\s-]/g, ' ')
    .trim();

  if (!cleaned) {
    return 'business';
  }

  for (const [pattern, topic] of ALIAS_TO_TOPIC) {
    if (pattern.test(cleaned)) {
      return topic;
    }
  }

  const tokens = cleaned.split(/[,\s-]+/).filter(Boolean);
  for (const token of tokens) {
    if (TOPIC_PHOTO_IDS[token]) {
      return token;
    }
  }

  return 'business';
}

/**
 * Build a stable Unsplash URL from a keyword/tag string.
 * @param {string} keyword
 * @param {number} [width]
 * @param {number} [salt] - vary photo within the same topic pool
 */
export function buildTopicImageUrl(keyword, width = 1200, salt = 0) {
  const topic = resolveTopicKey(keyword);
  const pool = TOPIC_PHOTO_IDS[topic] || TOPIC_PHOTO_IDS.business;
  const index = hashString(`${topic}:${keyword}:${salt}`) % pool.length;
  const w = Number.isFinite(width) ? Math.max(400, Math.min(1600, width)) : 1200;
  return UNSplash(pool[index], w);
}

export function isUnreliableImageUrl(url = '') {
  const value = String(url || '').trim();
  if (!value) {
    return true;
  }
  return /loremflickr|placehold|via\.placeholder|example\.com|picsum\.photos\/id\/0|gray|placeholder/i.test(
    value,
  );
}
