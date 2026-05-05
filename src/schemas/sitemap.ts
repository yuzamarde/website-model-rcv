/**
 * SITEMAP — Response Shape
 *
 * Endpoint: GET /api/public/user/id/:userId/sitemap
 * Cache TTL: 1 hour.
 *
 * `sections` are page slugs ('' = home page).
 * `portfolioIds` are MongoDB ObjectId strings for individual portfolio detail pages.
 */
import { z } from 'zod';

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

export const SitemapSchema = z.object({
    sections: z.array(z.string()),
    portfolioIds: z.array(z.string()),
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
};
