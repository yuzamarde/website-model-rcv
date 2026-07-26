/**
 * SITEMAP — Response Shape
 *
 * Endpoint: GET /api/public/user/id/:userId/sitemap
 * Cache TTL: 1 hour.
 *
 * `sections` are page slugs ('' = home page).
 * `portfolioIds` are MongoDB ObjectId strings for individual portfolio detail pages.
 *
 * v1.1 (RFC-0041, 2026-07-21) — ADDITIVE `portfolios[]`: one `{ id, slug }` row
 * per portfolio, `slug` null until generated (see schemas/portfolio.ts). This is
 * what lets a sitemap-consuming template publish the SEO-friendly
 * `/portfolio/slug/:slug` URL alongside the id URL. `portfolioIds` is retained
 * forever (additive-only) — existing consumers are unaffected.
 * v1.2 (RFC-0044, 2026-07-26) — ADDITIVE. Each `portfolios[]` row gains
 * `slugScope` and `ownerHandle` (same semantics as `PortfolioItemSchema` in
 * schemas/portfolio.ts) so a sitemap-consuming template can emit the correct
 * SCOPED slug URL (`…/portfolio/owner/slug/:slug` or
 * `…/portfolio/creator/:ownerHandle/slug/:slug`) instead of only the legacy
 * unscoped one. Both null when `slug` is null.
 */
import { z } from 'zod';
import { PORTFOLIO_SLUG_SCOPE_VALUES } from './portfolio.js';

export const SITEMAP_SECTIONS = [
    '',
    'experience',
    'education',
    'certification',
    'portfolio',
    'skills',
    'languages',
    'contact',
] as const;
export type SitemapSection = (typeof SITEMAP_SECTIONS)[number];

// RFC-0041 — one portfolio row for sitemap generation: the id (always present)
// plus its SEO slug (null until generated). Optional array so consumers pinned
// to a pre-1.1 tag keep validating; `portfolioIds` stays the fallback source.
export const SitemapPortfolioRefSchema = z.object({
    id: z.string(),
    slug: z.string().nullable(),
    // RFC-0044 (v1.2) — same semantics as PortfolioItemSchema's slugScope/
    // ownerHandle pair in schemas/portfolio.ts. Both null when `slug` is null.
    slugScope: z.enum(PORTFOLIO_SLUG_SCOPE_VALUES).nullable(),
    ownerHandle: z.string().nullable(),
});
export type SitemapPortfolioRef = z.infer<typeof SitemapPortfolioRefSchema>;

export const SitemapSchema = z.object({
    sections: z.array(z.string()),
    portfolioIds: z.array(z.string()),
    portfolios: z.array(SitemapPortfolioRefSchema).optional(),
});

export type Sitemap = z.infer<typeof SitemapSchema>;

export const SITEMAP_EXAMPLE: Sitemap = {
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
    portfolios: [
        { id: '64f1a2b3c4d5e6f7a8b9c0d9', slug: 'e-commerce-dashboard', slugScope: 'owner', ownerHandle: null },
        { id: '64f1a2b3c4d5e6f7a8b9c0e0', slug: null, slugScope: null, ownerHandle: null },
    ],
};
