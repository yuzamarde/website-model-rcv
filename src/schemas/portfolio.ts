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
 * v4.2 — RFC-0037 trust links (2026-07-09) — ADDITIVE. DETAIL appends `owner`
 *        (PortfolioPersonRefSchema), `clientKind` / `clientUser` /
 *        `clientCompanyId` (RFC-0034 client link, resolved — raw ids never
 *        exposed), and creators[] items append `profileUrl`. The login
 *        `username` itself stays un-emitted (data minimization) — it is only
 *        embedded inside the derived `profileUrl`. LIST unchanged.
 * v4.3 — RFC-0041 portfolio slug (2026-07-21) — ADDITIVE. Both DETAIL
 *        (`PortfolioItemSchema`) and LIST (`PortfolioListItemSchema`) gain
 *        `slug` (nullable string, appended after `title`) — an SEO-friendly
 *        detail-URL identifier derived server-side from `title`. Regenerated
 *        whenever `title` changes; legacy docs read `null` until their next
 *        edit (lazy-fill, no backfill). Unique per owning user, never global
 *        — the field carries no uniqueness guarantee at the schema level.
 * v4.4 — RFC-0044 title uniqueness + scoped slug routes (2026-07-26) —
 *        ADDITIVE. Both DETAIL and LIST gain `slugScope` (nullable enum
 *        `'owner' | 'creator'`) and `ownerHandle` (nullable string, the
 *        `slug`'s owning user's username) appended after `slug`. These let a
 *        template construct the correct scoped detail URL —
 *        `…/portfolio/owner/slug/:slug` when `slugScope === 'owner'`, or
 *        `…/portfolio/creator/:ownerHandle/slug/:slug` when `'creator'` —
 *        without any server-side parsing. Both fields are null on an item
 *        whose `slug` is itself null (nothing to scope yet). The pre-existing
 *        `…/portfolio/slug/:slug` endpoint (RFC-0041) is UNCHANGED and kept
 *        forever; these two fields describe the NEW scoped alternatives, they
 *        do not replace anything.
 */
import { z } from 'zod';

export const PORTFOLIO_STATUS_VALUES = ['Completed', 'In Progress', 'Archived'] as const;
export type PortfolioStatus = (typeof PORTFOLIO_STATUS_VALUES)[number];

export const PORTFOLIO_VISIBILITY_VALUES = ['Draft', 'Published'] as const;
export type PortfolioVisibility = (typeof PORTFOLIO_VISIBILITY_VALUES)[number];

export const PORTFOLIO_BLOCK_TYPES = ['image', 'description'] as const;
export type PortfolioBlockType = (typeof PORTFOLIO_BLOCK_TYPES)[number];

// RFC-0044 (v4.4.0) — which of the two NEW scoped slug routes resolves this
// item's `slug` on the current site: 'owner' → `…/portfolio/owner/slug/:slug`,
// 'creator' → `…/portfolio/creator/:ownerHandle/slug/:slug`. Mirrors the
// legacy `…/portfolio/slug/:slug` route's own owner-first precedence, so a
// template that ignores these two fields and only ever calls the legacy route
// keeps working exactly as it does today.
export const PORTFOLIO_SLUG_SCOPE_VALUES = ['owner', 'creator'] as const;
export type PortfolioSlugScope = (typeof PORTFOLIO_SLUG_SCOPE_VALUES)[number];

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

// ============================================
// Creator credits (RFC-0031 Stage 2) — ADDITIVE
// ============================================
// A portfolio's collaborators, credited publicly on the detail response. The single
// OWNER is the site itself; `creators[]` lists *other* contributors who accepted an
// invitation. No internal id and no login `username` are ever exposed (buyer-data
// minimization). Since v4.2 (RFC-0037) the derived `profileUrl` IS exposed — a
// deliberate decision so templates can render the credit as a clickable link to the
// person's profile on the main website (the handle only appears embedded in that
// URL). `kind` discriminates 'user' (today) from 'company' (forward-declared;
// never populated until a Company entity ships).
export const PORTFOLIO_CREATOR_KINDS = ['user', 'company'] as const;
export type PortfolioCreatorKind = (typeof PORTFOLIO_CREATOR_KINDS)[number];

export const PortfolioCreatorSchema = z.object({
    kind:      z.enum(PORTFOLIO_CREATOR_KINDS),
    name:      z.string().nullable(),
    photo:     z.string().nullable(),
    roleTitle: z.string().nullable(),
    // v4.2 (RFC-0037) — ADDITIVE, appended after the v4.1 keys. Main-site profile
    // link (FRONTEND_URL + '/' + username, derived server-side). Optional so
    // consumers pinned to a pre-4.2 tag keep validating; kind 'company' → null.
    profileUrl: z.string().nullable().optional(),
});
export type PortfolioCreator = z.infer<typeof PortfolioCreatorSchema>;

// ============================================
// Person ref + client link (RFC-0037, v4.2.0) — ADDITIVE
// ============================================
// Public-safe reference to a platform user, shown on the buyer site as a clickable
// credit. `profileUrl` points at the person's profile on the main website
// (FRONTEND_URL + '/' + username, derived server-side; null when the user has no
// resolvable username). The login `username` itself is NOT a key here (buyer-data
// minimization — it only appears embedded in the URL). All fields nullable — an
// unresolvable ref (deleted user, missing profile row) degrades to nulls, never
// to a missing key (empty-data contract style). Internal ids are NEVER exposed.
export const PortfolioPersonRefSchema = z.object({
    name:       z.string().nullable(),
    photo:      z.string().nullable(),
    profileUrl: z.string().nullable(),
});
export type PortfolioPersonRef = z.infer<typeof PortfolioPersonRefSchema>;

// RFC-0034 client link — discriminates the OPTIONAL link beside the required
// `client` display string (which stays the display SSOT forever): null = plain-text
// client; 'user' → `clientUser` (resolved PersonRef); 'company' → `clientCompanyId`
// (opaque cross-service id — by design a string, never an internal ObjectId).
// Neither kind is constructible until RFC-0034 P1 ships — emitted as null until then.
export const PORTFOLIO_CLIENT_KINDS = ['user', 'company'] as const;
export type PortfolioClientKind = (typeof PORTFOLIO_CLIENT_KINDS)[number];

export const PortfolioItemSchema = z.object({
    _id: z.string(),
    title: z.string(),
    // v4.3 (RFC-0041) — ADDITIVE. SEO-friendly slug derived from `title`; null
    // until generated (create, or first edit for legacy docs). Regenerated
    // whenever `title` changes. Optional so pre-4.3 consumers keep validating.
    slug: z.string().nullable().optional(),
    // v4.4 (RFC-0044) — ADDITIVE. Tells a template which scoped route resolves
    // `slug` on this site: 'owner' or 'creator'. Null when `slug` itself is
    // null. Optional so pre-4.4 consumers keep validating.
    slugScope: z.enum(PORTFOLIO_SLUG_SCOPE_VALUES).nullable().optional(),
    // v4.4 (RFC-0044) — ADDITIVE. The username to plug into
    // `…/portfolio/creator/:ownerHandle/slug/:slug` when `slugScope ===
    // 'creator'`. Null when `slugScope` is 'owner' or null. Optional so
    // pre-4.4 consumers keep validating.
    ownerHandle: z.string().nullable().optional(),
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
    // RFC-0031 Stage 2 — collaborator credits (ADDITIVE, optional). Present on the
    // public DETAIL response (empty array when the portfolio has no accepted
    // collaborators); not emitted on the slim LIST item. Optional so consumers
    // pinned to a pre-RFC-0031 tag keep validating.
    creators: z.array(PortfolioCreatorSchema).optional(),
    // RFC-0037 (v4.2.0) — trust links, ALL ADDITIVE, appended after `creators`:
    // `owner` — the portfolio owner as a clickable credit. Always a full-key
    //   object (nullable fields) when emitted; matters on a CREATOR's site,
    //   where the owner is someone else (RFC-0031 co-created items).
    owner: PortfolioPersonRefSchema.optional(),
    // Client link (RFC-0034 — storage shipped P0, activation P1). `client`
    //   above stays the required display string; these carry the optional
    //   clickable link. Raw clientUserRef ObjectId is NEVER emitted — it is
    //   resolved into `clientUser` (PersonRef) server-side.
    clientKind: z.enum(PORTFOLIO_CLIENT_KINDS).nullable().optional(),
    clientUser: PortfolioPersonRefSchema.nullable().optional(),
    clientCompanyId: z.string().nullable().optional(),
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
    // v4.3 (RFC-0041) — ADDITIVE, same semantics as PortfolioItemSchema.slug.
    slug:           z.string().nullable().optional(),
    // v4.4 (RFC-0044) — ADDITIVE, same semantics as PortfolioItemSchema's
    // slugScope/ownerHandle pair.
    slugScope:      z.enum(PORTFOLIO_SLUG_SCOPE_VALUES).nullable().optional(),
    ownerHandle:    z.string().nullable().optional(),
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
        slug: 'e-commerce-dashboard',
        slugScope: 'owner',
        ownerHandle: null,
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
        creators: [
            { kind: 'user', name: 'Bob Designer', photo: 'https://cdn.example.com/avatars/bob.jpg', roleTitle: 'Lead Designer', profileUrl: 'https://rcv.lt/bobdesigner' },
        ],
        // RFC-0037 (v4.2.0) — trust links (appended after `creators`).
        owner: { name: 'John Doe', photo: 'https://cdn.example.com/avatars/john.jpg', profileUrl: 'https://rcv.lt/johndoe' },
        clientKind: null,
        clientUser: null,
        clientCompanyId: null,
    },
];

// Phase 15 (v4.0.0) — slim LIST shape example. Mirrors PortfolioListItemSchema.
export const PORTFOLIO_LIST_EXAMPLE: PortfolioList = [
    {
        _id: '64f1a2b3c4d5e6f7a8b9c0d9',
        title: 'E-Commerce Dashboard',
        slug: 'e-commerce-dashboard',
        slugScope: 'owner',
        ownerHandle: null,
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
