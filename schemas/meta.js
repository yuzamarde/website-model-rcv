/**
 * ============================================
 * META — Response Shape
 * ============================================
 *
 * Endpoint:
 *   GET /api/public/user/id/:userId/meta
 *
 * Formatter: formatWebsiteUserMeta
 * Cache TTL: 1 hour
 *
 * Use this endpoint to populate <head> SEO tags and OpenGraph meta.
 * Combines user profile, skills (for keywords), and first portfolio image.
 *
 * Privacy mask is applied: city/country may be null if sharePersonalInfo is off.
 */

/**
 * @typedef {Object} MetaResponse
 * @property {string}      title       - Page title: "{name} – {profesional}" or just "{name}"
 * @property {string}      description - Meta description: user's deskription or fallback
 * @property {string|null} image       - OG image URL (photo → first portfolio image → null)
 * @property {string[]}    keywords    - Flat list of all user skills (from skill stacks)
 * @property {string}      location    - "City, Country" or "Country" or "" if private
 * @property {string}      type        - Always "profile"
 */

export const META_SHAPE = {
    title:       'string',
    description: 'string',
    image:       'string | null',
    keywords:    'string[]',
    location:    'string',
    type:        '"profile"',
};

// ─── Example Response ─────────────────────────────────────────────────────────

export const META_EXAMPLE = {
    title:       'John Doe – Fullstack Developer',
    description: 'Passionate developer with 5 years of experience in web and mobile.',
    image:       'https://cdn.example.com/photos/johndoe.jpg',
    keywords:    ['React', 'Next.js', 'Node.js', 'MongoDB', 'TypeScript'],
    location:    'Jakarta, Indonesia',
    type:        'profile',
};

// ─── Usage in Next.js ─────────────────────────────────────────────────────────

/**
 * Example: using meta response in Next.js <Head>
 *
 * const meta = await fetch(`/api/public/user/id/${userId}/meta`).then(r => r.json());
 *
 * <Head>
 *   <title>{meta.data.title}</title>
 *   <meta name="description" content={meta.data.description} />
 *   <meta name="keywords" content={meta.data.keywords.join(', ')} />
 *   <meta property="og:title" content={meta.data.title} />
 *   <meta property="og:description" content={meta.data.description} />
 *   {meta.data.image && <meta property="og:image" content={meta.data.image} />}
 *   <meta property="og:type" content={meta.data.type} />
 * </Head>
 */
