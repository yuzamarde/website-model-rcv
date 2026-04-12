/**
 * ============================================
 * SOCIAL ACCOUNT — Response Shape
 * ============================================
 *
 * Endpoint:
 *   GET /api/public/user/id/:userId/social
 *
 * Formatter: formatSocialAccounts → formatSocialAccount[]
 * Cache TTL: 5 minutes
 *
 * Returns an array of social media / contact links.
 * `social` is the populated platform info (name + URL pattern).
 */

/**
 * @typedef {Object} SocialPlatform
 * @property {string} _id  - Platform ObjectId
 * @property {string} name - Platform name (e.g., "GitHub", "LinkedIn")
 * @property {string} path - URL pattern (e.g., "https://github.com/")
 */

/**
 * @typedef {Object} SocialAccountItem
 * @property {string}         _id       - MongoDB ObjectId string
 * @property {string}         name      - Display name / handle (e.g., "@johndoe")
 * @property {string}         url       - Full profile URL
 * @property {SocialPlatform} social    - Populated platform info
 * @property {number}         order     - Display order (ascending)
 * @property {string}         createdAt - ISO 8601
 * @property {string}         updatedAt - ISO 8601
 */

export const SOCIAL_PLATFORM_SHAPE = {
    _id:  'string',
    name: 'string',
    path: 'string',
};

export const SOCIAL_ACCOUNT_SHAPE = {
    _id:       'string',
    name:      'string',
    url:       'string',
    social:    'SocialPlatform',
    order:     'number',
    createdAt: 'string',
    updatedAt: 'string',
};

// ─── Example Response ─────────────────────────────────────────────────────────

export const SOCIAL_ACCOUNT_EXAMPLE = [
    {
        _id:  '64f1a2b3c4d5e6f7a8b9c0d5',
        name: 'johndoe',
        url:  'https://github.com/johndoe',
        social: {
            _id:  '64f1a2b3c4d5e6f7a8b9c0e1',
            name: 'GitHub',
            path: 'https://github.com/',
        },
        order:     1,
        createdAt: '2024-01-10T09:00:00.000Z',
        updatedAt: '2024-01-10T09:00:00.000Z',
    },
    {
        _id:  '64f1a2b3c4d5e6f7a8b9c0d6',
        name: 'John Doe',
        url:  'https://linkedin.com/in/johndoe',
        social: {
            _id:  '64f1a2b3c4d5e6f7a8b9c0e2',
            name: 'LinkedIn',
            path: 'https://linkedin.com/in/',
        },
        order:     2,
        createdAt: '2024-01-10T09:00:00.000Z',
        updatedAt: '2024-01-10T09:00:00.000Z',
    },
];
