/**
 * PORTFOLIO — Response Shape
 *
 * Endpoints:
 *   GET /api/public/user/site/:apiKey/portfolio       → LIST (slim 12 fields per item, paginated)
 *   GET /api/public/user/site/:apiKey/portfolio/:id   → DETAIL (full 24 fields)
 *
 * Cache TTL: 5 minutes (both endpoints).
 *
 * Pagination (LIST only — Phase 15, v4.0.0):
 *   Query params: ?limit=N&offset=N
 *     limit: int, default 12, min 10, max 50
 *     offset: int, default 0, non-negative
 *   Response meta: { usedCategories, total, limit, offset, hasMore }
 *
 * Filters (LIST only):
 *   visibility = 'Published' (always — `visibility` field NOT exposed on list)
 *   status != 'Archived'     (only Completed + In Progress shown)
 *   sort by `order` ascending
 *
 * v2.2 — replaced `longDescription` (sanitized HTML) + `gallery[]` with a
 *        single typed `content[]` array.
 * v2.3 — adds `imageId` / `pdfId` / `videoId` / `content[].mediaId` on read
 *        responses (additive, non-breaking) for edit-form round-trip.
 * v3.0 — Phase 11 — basicInfo redefine; portfolio unchanged.
 * v4.0 — Phase 15 BREAKING — LIST endpoint shape SPLIT from DETAIL.
 *        LIST returns NEW PortfolioListItemSchema (12 fields). Detail unchanged.
 *        Dropped from list: content[], pdf, url, video* (no — video kept),
 *        role, dates, status flags, ids, timestamps.
 *        Kept on list per user spec: _id, title, client, description, image,
 *        category, skillsStack, order, status, verified, video, videoThumbnail.
 *        Pagination added with offset/limit + meta envelope extension.
 *        Templates' list-card UIs that used url/pdf must fetch /portfolio/:id
 *        on click to retrieve full shape.
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

// ============================================
// LIST shape (Phase 15, v4.0.0) — SLIM 12-field item
// ============================================
// User-curated field set for the /portfolio LIST endpoint. Full shape moves to
// /portfolio/:id detail endpoint. Reduces server work (drops content[].media
// nested $lookup) + wire payload (~-80%).
//
// Fields explicitly per user spec:
//   _id, title, client, description, image, category, skillsStack,
//   order, status, verified, video, videoThumbnail
//
// Fields explicitly DROPPED from list (still present on detail):
//   url, pdf, pdfId, imageId, videoId, content[], role, startDate, endDate,
//   sourceUrl, visibility, createdAt, updatedAt
//
// Notes:
//   - `visibility` dropped because server filter pins it to 'Published'
//   - `status` retained but Archived items filtered server-side
//   - `video` + `videoThumbnail` retained per user — populated via .populate('video', 'secureUrl thumbnail')
export const PortfolioListItemSchema = z.object({
    _id:            z.string(),
    title:          z.string(),
    client:         z.string(),
    description:    z.string(),
    image:          z.string().nullable(),
    category:       PortfolioCategorySchema.nullable(),
    skillsStack:    z.array(z.string()),
    order:          z.number(),
    status:         z.enum(PORTFOLIO_STATUS_VALUES),
    verified:       z.boolean(),
    video:          z.string().nullable(),
    videoThumbnail: z.string().nullable(),
});

export const PortfolioListSchema = z.array(PortfolioListItemSchema);

/**
 * The LIST envelope wraps PortfolioListSchema (slim) and exposes pagination
 * metadata under `meta`. The `usedCategories` array is computed across ALL
 * portfolios matching the server filter (NOT just the current page) so the
 * filter-chip UI on page 1 shows every available category.
 *
 *   {
 *     message: "Portfolio retrieved",
 *     data: PortfolioListItem[],
 *     meta: {
 *       usedCategories: string[],
 *       total: number,
 *       limit: number,
 *       offset: number,
 *       hasMore: boolean,
 *     }
 *   }
 */
export const PortfolioListMetaSchema = z.object({
    usedCategories: z.array(z.string()),
    total:          z.number().int().nonnegative(),
    limit:          z.number().int().min(10).max(50),
    offset:         z.number().int().nonnegative(),
    hasMore:        z.boolean(),
});

export const PortfolioListEnvelopeSchema = z.object({
    message: z.string(),
    data: PortfolioListSchema,
    meta: PortfolioListMetaSchema,
});

export type PortfolioCategory = z.infer<typeof PortfolioCategorySchema>;
export type PortfolioImageBlock = z.infer<typeof PortfolioImageBlockSchema>;
export type PortfolioDescriptionBlock = z.infer<typeof PortfolioDescriptionBlockSchema>;
export type PortfolioContentBlock = z.infer<typeof PortfolioContentBlockSchema>;
export type PortfolioItem = z.infer<typeof PortfolioItemSchema>;
export type Portfolio = z.infer<typeof PortfolioSchema>;
export type PortfolioListItem = z.infer<typeof PortfolioListItemSchema>;
export type PortfolioList = z.infer<typeof PortfolioListSchema>;
export type PortfolioListMeta = z.infer<typeof PortfolioListMetaSchema>;
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

// Phase 15 (v4.0.0) — slim LIST shape example. Mirrors PortfolioListItemSchema.
export const PORTFOLIO_LIST_EXAMPLE: PortfolioList = [
    {
        _id: '64f1a2b3c4d5e6f7a8b9c0d9',
        title: 'E-Commerce Dashboard',
        client: 'Tokopedia',
        description: 'Real-time analytics dashboard for seller performance.',
        image: 'https://cdn.example.com/portfolio/ecommerce.jpg',
        category: { _id: '64f1a2b3c4d5e6f7a8b9c0e3', name: 'Web App' },
        skillsStack: ['React', 'Node.js', 'MongoDB'],
        order: 1,
        status: 'Completed',
        verified: false,
        video: null,
        videoThumbnail: null,
    },
];

export const PORTFOLIO_LIST_ENVELOPE_EXAMPLE: PortfolioListEnvelope = {
    message: 'Portfolio retrieved',
    data: PORTFOLIO_LIST_EXAMPLE,
    meta: {
        usedCategories: ['Web App', 'Mobile', 'Data Science'],
        total:   1,
        limit:   12,
        offset:  0,
        hasMore: false,
    },
};
