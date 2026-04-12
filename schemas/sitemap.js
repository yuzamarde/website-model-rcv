/**
 * ============================================
 * SITEMAP — Response Shape
 * ============================================
 *
 * Endpoint:
 *   GET /api/public/user/id/:userId/sitemap
 *
 * Formatter: formatWebsiteUserSitemap
 * Cache TTL: 1 hour
 *
 * Use this endpoint to dynamically generate a sitemap.xml
 * for the user's portfolio website.
 *
 * `sections` are the available page slugs (empty string = home page).
 * `portfolioIds` are MongoDB ObjectId strings for individual portfolio pages.
 */

/**
 * @typedef {Object} SitemapResponse
 * @property {string[]} sections      - Available page route slugs ('' = home)
 * @property {string[]} portfolioIds  - Portfolio ObjectId strings for detail pages
 */

export const SITEMAP_SHAPE = {
    sections:     'string[]',
    portfolioIds: 'string[]',
};

/** Fixed sections always included in the sitemap */
export const SITEMAP_SECTIONS = [
    '',               // Home page  →  /
    'experience',     //             →  /experience
    'education',      //             →  /education
    'certification',  //             →  /certification
    'portfolio',      //             →  /portfolio
    'skills',         //             →  /skills
    'languages',      //             →  /languages
    'contact',        //             →  /contact
];

// ─── Example Response ─────────────────────────────────────────────────────────

export const SITEMAP_EXAMPLE = {
    sections: [
        '',
        'experience',
        'education',
        'certification',
        'portfolio',
        'skills',
        'languages',
        'contact',
    ],
    portfolioIds: [
        '64f1a2b3c4d5e6f7a8b9c0d9',
        '64f1a2b3c4d5e6f7a8b9c0e0',
    ],
};

// ─── Usage in Next.js ─────────────────────────────────────────────────────────

/**
 * Example: generating sitemap.xml from this response
 *
 * const sitemap = await fetch(`/api/public/user/id/${userId}/sitemap`).then(r => r.json());
 * const base = `https://yoursite.com/${username}`;
 *
 * const urls = [
 *   ...sitemap.data.sections.map(s => `${base}${s ? '/' + s : ''}`),
 *   ...sitemap.data.portfolioIds.map(id => `${base}/portfolio/${id}`),
 * ];
 *
 * // → [
 * //   "https://yoursite.com/johndoe",
 * //   "https://yoursite.com/johndoe/experience",
 * //   "https://yoursite.com/johndoe/portfolio",
 * //   "https://yoursite.com/johndoe/portfolio/64f1a2b3c4d5e6f7a8b9c0d9",
 * //   ...
 * // ]
 */
