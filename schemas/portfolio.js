/**
 * ============================================
 * PORTFOLIO — Response Shape
 * ============================================
 *
 * Endpoints:
 *   GET /api/public/user/id/:userId/portfolio          → array (list)
 *   GET /api/public/user/id/:userId/portfolio/:id      → single object (detail)
 *
 * Formatter: formatPortfolios / formatPortfolio
 * Cache TTL: 5 minutes
 *
 * List endpoint:
 *   - Excludes items with status "Archived"
 *   - Sorted by `order` field (ascending)
 *   - Includes `usedCategories` in the response meta:
 *       { "message": "...", "data": [...], "usedCategories": ["Web App", "Mobile"] }
 *
 * Detail endpoint:
 *   - Returns a single portfolio object
 */

/**
 * @typedef {Object} PortfolioCategory
 * @property {string} _id  - Category ObjectId string
 * @property {string} name - Category display name
 */

/**
 * @typedef {Object} PortfolioItem
 * @property {string}                    _id            - MongoDB ObjectId string
 * @property {string}                    title          - Project title
 * @property {string}                    client         - Client / company name
 * @property {string}                    url            - Live project URL
 * @property {string}                    description    - Project description (default: '')
 * @property {string|null}               image          - Main cover image URL
 * @property {string|null}               pdf            - PDF document URL
 * @property {PortfolioCategory|null}    category       - Populated category object or null
 * @property {string[]}                  skillsStack    - Technologies / skills used
 * @property {number}                    order          - Display order (ascending, default 0)
 * @property {string|null}               role           - Role in this project
 * @property {string|null}               startDate      - Start date (raw string)
 * @property {string|null}               endDate        - End date (raw string) or null if ongoing
 * @property {boolean}                   isFeatured     - Whether project is featured (default false)
 * @property {string}                    status         - Project status (see PORTFOLIO_STATUS_VALUES)
 * @property {string|null}               sourceUrl      - Source code / repo URL
 * @property {string[]}                  images         - Additional image URLs (default [])
 * @property {string|null}               video          - Video URL
 * @property {string|null}               videoThumbnail - Video thumbnail URL
 * @property {string}                    createdAt      - ISO 8601
 * @property {string}                    updatedAt      - ISO 8601
 */

export const PORTFOLIO_CATEGORY_SHAPE = {
    _id:  'string',
    name: 'string',
};

export const PORTFOLIO_SHAPE = {
    _id:            'string',
    title:          'string',
    client:         'string',
    url:            'string',
    description:    'string',
    image:          'string | null',
    pdf:            'string | null',
    category:       'PortfolioCategory | null',
    skillsStack:    'string[]',
    order:          'number',
    role:           'string | null',
    startDate:      'string | null',
    endDate:        'string | null',
    isFeatured:     'boolean',
    status:         'string',
    sourceUrl:      'string | null',
    images:         'string[]',
    video:          'string | null',
    videoThumbnail: 'string | null',
    createdAt:      'string',
    updatedAt:      'string',
};

// ─── Enum Values ──────────────────────────────────────────────────────────────

/** Valid values for `status` field */
export const PORTFOLIO_STATUS_VALUES = ['Completed', 'In Progress', 'Archived'];

// ─── List Endpoint — Response Meta ────────────────────────────────────────────

/**
 * The /portfolio list endpoint includes extra meta in the response envelope:
 *
 * {
 *   "message": "Portfolio retrieved",
 *   "data": PortfolioItem[],
 *   "usedCategories": string[]   ← unique category names used by this user
 * }
 */

// ─── Example Response ─────────────────────────────────────────────────────────

export const PORTFOLIO_EXAMPLE = [
    {
        _id:            '64f1a2b3c4d5e6f7a8b9c0d9',
        title:          'E-Commerce Dashboard',
        client:         'Tokopedia',
        url:            'https://dashboard.tokopedia.com',
        description:    'Real-time analytics dashboard for seller performance.',
        image:          'https://cdn.example.com/portfolio/ecommerce.jpg',
        pdf:            null,
        category:       { _id: '64f1a2b3c4d5e6f7a8b9c0e3', name: 'Web App' },
        skillsStack:    ['React', 'Node.js', 'MongoDB'],
        order:          1,
        role:           'Lead Frontend Developer',
        startDate:      '2023-01-01',
        endDate:        '2023-06-01',
        isFeatured:     true,
        status:         'Completed',
        sourceUrl:      'https://github.com/johndoe/ecommerce-dashboard',
        images:         [
            'https://cdn.example.com/portfolio/ecommerce-2.jpg',
            'https://cdn.example.com/portfolio/ecommerce-3.jpg',
        ],
        video:          null,
        videoThumbnail: null,
        createdAt:      '2024-01-10T09:00:00.000Z',
        updatedAt:      '2024-01-10T09:00:00.000Z',
    },
];
