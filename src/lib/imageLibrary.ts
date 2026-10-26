// Curated free Unsplash photos used as stand-in product/lifestyle imagery until
// real brand photography exists. Every ID below was individually fetched and visually
// reviewed (not just checked for HTTP 200) to confirm it matches its bucket and has no
// visible third-party branding/logos. Grouped into keyword buckets so a product's seed
// string (its slug, which already encodes garment type) picks an appropriate photo,
// deterministically — the same seed always resolves to the same photo.

function unsplash(id: string, w = 900): string {
  return `https://images.unsplash.com/photo-${id}?w=${w}&q=70&auto=format&fit=crop`;
}

interface Bucket {
  /** Seed substrings that route to this bucket, checked in order. */
  keywords: string[];
  photoIds: string[];
}

const BUCKETS: Bucket[] = [
  {
    // Category tiles use seeds like "tile-dresses"/"tile-tops"/"tile-bottoms"/"tile-accessories" —
    // matched explicitly, ahead of the generic buckets below, so each tile gets a specific photo
    // rather than falling through to whatever a generic keyword match happens to pick.
    keywords: ["tile-dresses"],
    photoIds: ["1515372039744-b8f02a3ae446"],
  },
  {
    keywords: ["tile-tops"],
    photoIds: ["1770294758906-c8762abb2c8b"],
  },
  {
    keywords: ["tile-bottoms"],
    photoIds: ["1687825515654-23620796760c"],
  },
  {
    keywords: ["tile-accessories"],
    photoIds: ["1605733513597-a8f8341084e6"],
  },
  {
    keywords: ["dress", "dresses", "gown", "occasion"],
    photoIds: [
      "1515372039744-b8f02a3ae446", // white off-shoulder dress on steps
      "1566174053879-31528523f8ae", // plum off-shoulder gown, studio
      "1591369822096-ffd140ec948f", // denim shirt-dress
      "1671848633245-79cc98b0dbe8", // tropical print maxi dress
    ],
  },
  {
    keywords: ["blouse", "tank", "top"],
    photoIds: [
      "1770294758906-c8762abb2c8b", // sleeveless white blouse, studio
      "1485462537746-965f33f7f6a7", // pink coat over top, editorial
    ],
  },
  {
    keywords: ["trouser", "skirt", "chino"],
    photoIds: [
      "1687825515654-23620796760c", // green wide-leg trousers
      "1790384074526-30550d190a7c", // burgundy wide-leg trousers
    ],
  },
  {
    keywords: ["tote", "crossbody", "bag"],
    photoIds: [
      "1605733513597-a8f8341084e6", // grey leather satchel, studio
      "1473188588951-666fce8e7c68", // brown leather satchel on concrete
      "1624687943971-e86af76d57de", // brown leather handbag
    ],
  },
  {
    keywords: ["belt"],
    photoIds: [
      "1711443982852-b3df5c563448", // woven leather belts, product shot
    ],
  },
  {
    keywords: ["necklace", "jewellery", "jewelry"],
    photoIds: [
      "1705326454924-f6777522b030", // gold necklace on display bust
      "1600862754152-80a263dd564f", // beaded necklace product shot
    ],
  },
  {
    keywords: ["hero"],
    photoIds: [
      "1671848633245-79cc98b0dbe8", // tropical maxi dress, architectural bg
      "1783113298856-8b644c9cf7ce", // white linen shirt, resort lounge
      "1485968579580-b6d095142e6e", // plaid coat, editorial street
    ],
  },
  {
    keywords: ["shop-the-look"],
    photoIds: [
      "1783113298856-8b644c9cf7ce", // white linen shirt, resort lounge chairs
    ],
  },
  {
    keywords: ["tile", "post", "community"],
    photoIds: [
      "1634047111145-bb4c8a0c581e", // friends on a bench, street style
      "1634047112138-da2819ee0e92", // three friends, street style
      "1634047112090-7164cde98e84", // two friends on a street
      "1485968579580-b6d095142e6e",
      "1566174053879-31528523f8ae",
    ],
  },
];

const FALLBACK_PHOTO_IDS = [
  "1515372039744-b8f02a3ae446",
  "1770294758906-c8762abb2c8b",
  "1605733513597-a8f8341084e6",
];

/** Real local brand photography, keyed by seed — checked before the Unsplash buckets. */
const LOCAL_OVERRIDES: Record<string, string> = {
  "hero-1": "/images/hero-valestra.jpg",
};

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/**
 * Word-boundary substring match — plain `.includes()` would let "men" false-match
 * inside "women", since product seeds are hyphen-delimited (e.g. "oxford-check-shirt-ivory-a").
 */
function matchesKeyword(seed: string, keyword: string): boolean {
  return new RegExp(`(^|[^a-z])${keyword}([^a-z]|$)`).test(seed);
}

/** Deterministically resolves a seed string to a real curated Unsplash photo URL. */
export function resolveImageUrl(seed: string, width = 900): string {
  if (LOCAL_OVERRIDES[seed]) return LOCAL_OVERRIDES[seed];
  const lower = seed.toLowerCase();
  const bucket = BUCKETS.find((b) => b.keywords.some((kw) => matchesKeyword(lower, kw)));
  const pool = bucket?.photoIds ?? FALLBACK_PHOTO_IDS;
  const photoId = pool[hashSeed(seed) % pool.length];
  return unsplash(photoId, width);
}
