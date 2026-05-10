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
 * v2.2 — replaced `longDescription` (sanitized HTML) + `gallery[]` with a
 *        single typed `content[]` array. Each block is either an image or a
 *        sanitized description-HTML chunk; array index = display order, with
 *        no constraints on sequencing (adjacent same-type blocks allowed).
 * v2.3 — adds `imageId` / `pdfId` / `videoId` / `content[].mediaId` on read
 *        responses (additive, non-breaking) so edit forms can round-trip
 *        unchanged Media refs without re-uploading.
 */
import { z } from 'zod';

export const PORTFOLIO_STATUS_VALUES = ['Completed', 'In Progress', 'Archived'] as const;
export type PortfolioStatus = (typeof PORTFOLIO_STATUS_VALUES)[number];

export const PORTFOLIO_VISIBILITY_VALUES = ['Draft', 'Published'] as const;
export type PortfolioVisibility = (typeof PORTFOLIO_VISIBILITY_VALUES)[number];

export const PORTFOLIO_BLOCK_TYPES = ['image', 'description'] as const;
export type PortfolioBlockType = (typeof PORTFOLIO_BLOCK_TYPES)[number];

export const PortfolioCategorySchema = z.object({
    _id: z.string(),
    name: z.string(),
});

// ============================================
// Content block schemas (discriminated on `type`)
// ============================================
export const PortfolioImageBlockSchema = z.object({
    type:    z.literal('image'),
    url:     z.string(),
    mediaId: z.string().nullable(),
    alt:     z.string().nullable(),
});

export const PortfolioDescriptionBlockSchema = z.object({
    type: z.literal('description'),
    html: z.string(),
});

export const PortfolioContentBlockSchema = z.discriminatedUnion('type', [
    PortfolioImageBlockSchema,
    PortfolioDescriptionBlockSchema,
]);

export const PortfolioItemSchema = z.object({
    _id: z.string(),
    title: z.string(),
    client: z.string(),
    url: z.string(),
    description: z.string(),
    image: z.string().nullable(),
    imageId: z.string().nullable(),
    pdf: z.string().nullable(),
    pdfId: z.string().nullable(),
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
    content: z.array(PortfolioContentBlockSchema),
    video: z.string().nullable(),
    videoId: z.string().nullable(),
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
export type PortfolioImageBlock = z.infer<typeof PortfolioImageBlockSchema>;
export type PortfolioDescriptionBlock = z.infer<typeof PortfolioDescriptionBlockSchema>;
export type PortfolioContentBlock = z.infer<typeof PortfolioContentBlockSchema>;
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
        image: 'https://cdn.example.com/portfolio/ecommerce.jpg',
        imageId: '64f1a2b3c4d5e6f7a8b9c0d1',
        pdf: null,
        pdfId: null,
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
        content: [
            { type: 'description', html: '<p>A real-time dashboard built for sellers on Tokopedia.</p>' },
            { type: 'description', html: '<ul><li>React + Node.js stack</li><li>WebSocket live updates</li></ul>' },
            { type: 'image', url: 'https://cdn.example.com/portfolio/ecommerce-2.jpg', mediaId: '64f1a2b3c4d5e6f7a8b9c0d4', alt: 'Dashboard overview' },
            { type: 'image', url: 'https://cdn.example.com/portfolio/ecommerce-3.jpg', mediaId: '64f1a2b3c4d5e6f7a8b9c0d5', alt: 'Category chart' },
            { type: 'description', html: '<h3>Outcome</h3><p>2× faster reporting cycle.</p>' },
        ],
        video: null,
        videoId: null,
        videoThumbnail: null,
        createdAt: '2024-01-10T09:00:00.000Z',
        updatedAt: '2024-01-10T09:00:00.000Z',
    },
];
