/**
 * PORTFOLIO — Response Shape
 *
 * Endpoints:
 *   GET /api/public/user/id/:userId/portfolio          → array (list)
 *   GET /api/public/user/id/:userId/portfolio/:id      → single object (detail)
 *
 * Cache TTL: 5 minutes.
 *
 * List endpoint excludes Archived items, sorted by `order` ascending.
 * The list envelope adds an extra `usedCategories: string[]` field
 * (see `PortfolioListEnvelopeSchema`).
 *
 * v2.1 — replaced legacy `images[]` / `imageCaptions[]` / `contentOrder[]`
 *        with `longDescription` (sanitized HTML) + `gallery[]` (max 5).
 *        Inline images inside longDescription use `<img data-media-id="..." src="...">`
 *        — clients should render the HTML as-is.
 */
import { z } from 'zod';

export const PORTFOLIO_STATUS_VALUES = ['Completed', 'In Progress', 'Archived'] as const;
export type PortfolioStatus = (typeof PORTFOLIO_STATUS_VALUES)[number];

export const PORTFOLIO_VISIBILITY_VALUES = ['Draft', 'Published'] as const;
export type PortfolioVisibility = (typeof PORTFOLIO_VISIBILITY_VALUES)[number];

export const PortfolioCategorySchema = z.object({
    _id: z.string(),
    name: z.string(),
});

export const PortfolioGalleryItemSchema = z.object({
    url:     z.string(),
    caption: z.string().nullable(),
    alt:     z.string().nullable(),
});

export const PortfolioItemSchema = z.object({
    _id: z.string(),
    title: z.string(),
    client: z.string(),
    url: z.string(),
    description: z.string(),
    longDescription: z.string(),
    image: z.string().nullable(),
    pdf: z.string().nullable(),
    category: PortfolioCategorySchema.nullable(),
    skillsStack: z.array(z.string()),
    order: z.number(),
    role: z.string().nullable(),
    startDate: z.string().nullable(),
    endDate: z.string().nullable(),
    status: z.enum(PORTFOLIO_STATUS_VALUES),
    sourceUrl: z.string().nullable(),
    visibility: z.enum(PORTFOLIO_VISIBILITY_VALUES),
    verified: z.boolean(),
    gallery: z.array(PortfolioGalleryItemSchema),
    video: z.string().nullable(),
    videoThumbnail: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const PortfolioSchema = z.array(PortfolioItemSchema);

/**
 * The list endpoint adds `usedCategories` to the envelope:
 *   { message, data: PortfolioItem[], usedCategories: string[] }
 */
export const PortfolioListEnvelopeSchema = z.object({
    message: z.string(),
    data: PortfolioSchema,
    usedCategories: z.array(z.string()),
});

export type PortfolioCategory = z.infer<typeof PortfolioCategorySchema>;
export type PortfolioGalleryItem = z.infer<typeof PortfolioGalleryItemSchema>;
export type PortfolioItem = z.infer<typeof PortfolioItemSchema>;
export type Portfolio = z.infer<typeof PortfolioSchema>;
export type PortfolioListEnvelope = z.infer<typeof PortfolioListEnvelopeSchema>;

export const PORTFOLIO_EXAMPLE: Portfolio = [
    {
        _id: '64f1a2b3c4d5e6f7a8b9c0d9',
        title: 'E-Commerce Dashboard',
        client: 'Tokopedia',
        url: 'https://dashboard.tokopedia.com',
        description: 'Real-time analytics dashboard for seller performance.',
        longDescription:
            '<p>A real-time dashboard built for sellers on Tokopedia.</p>' +
            '<figure>' +
            '<img data-media-id="64f1a2b3c4d5e6f7a8b9c0e1" ' +
            'src="https://cdn.example.com/portfolio/ecommerce-2.jpg" ' +
            'alt="Dashboard hero" loading="lazy" />' +
            '<figcaption>Live sales metrics</figcaption>' +
            '</figure>' +
            '<ul><li>React + Node.js stack</li><li>WebSocket live updates</li></ul>',
        image: 'https://cdn.example.com/portfolio/ecommerce.jpg',
        pdf: null,
        category: { _id: '64f1a2b3c4d5e6f7a8b9c0e3', name: 'Web App' },
        skillsStack: ['React', 'Node.js', 'MongoDB'],
        order: 1,
        role: 'Lead Frontend Developer',
        startDate: '2023-01-01',
        endDate: '2023-06-01',
        status: 'Completed',
        sourceUrl: 'https://github.com/johndoe/ecommerce-dashboard',
        visibility: 'Published',
        verified: false,
        gallery: [
            {
                url: 'https://cdn.example.com/portfolio/ecommerce-2.jpg',
                caption: 'Dashboard overview with live sales metrics',
                alt: 'Dashboard overview',
            },
            {
                url: 'https://cdn.example.com/portfolio/ecommerce-3.jpg',
                caption: 'Category breakdown chart by product type',
                alt: 'Category chart',
            },
        ],
        video: null,
        videoThumbnail: null,
        createdAt: '2024-01-10T09:00:00.000Z',
        updatedAt: '2024-01-10T09:00:00.000Z',
    },
];
