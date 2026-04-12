/**
 * ============================================
 * BASIC INFO — Response Shape
 * ============================================
 *
 * Endpoints:
 *   GET /api/public/user/id/:userId/basic
 *   GET /api/public/user/:username
 *
 * Formatter: formatWebsiteUserBasicInfo
 * Cache TTL: 5 minutes
 *
 * Note: email, phoneNumber, address, city, state, country may be null
 * if the user has disabled sharePersonalInfo.
 */

/**
 * @typedef {Object} BasicInfoResponse
 * @property {string}   username              - Unique username (URL-safe)
 * @property {string}   name                  - Full name
 * @property {string|null} email              - Email address (nullable if privacy off)
 * @property {string|null} phoneNumber        - Phone number (nullable if privacy off)
 * @property {string|null} profesional        - Professional title / headline (max 60 chars)
 * @property {string|null} deskription        - Bio / about me (max 500 chars)
 * @property {string|null} photo              - Profile photo URL
 * @property {string|null} city               - City (nullable if privacy off)
 * @property {string|null} address            - Address (nullable if privacy off)
 * @property {string|null} country            - Country
 * @property {string|null} state              - State / province
 * @property {string}   status                - Effective work status (see USER_STATUS)
 * @property {string}   role                  - User role (see USER_ROLES)
 * @property {string|null} coverVideo         - Cover video URL (MP4, max 30s)
 * @property {string|null} coverVideoThumbnail - Cover video thumbnail URL
 * @property {string[]}  usedCategories       - Portfolio category names used by this user
 */

export const BASIC_INFO_SHAPE = {
    username:             'string',
    name:                 'string',
    email:                'string | null',
    phoneNumber:          'string | null',
    profesional:          'string | null',
    deskription:          'string | null',
    photo:                'string | null',
    city:                 'string | null',
    address:              'string | null',
    country:              'string | null',
    state:                'string | null',
    status:               'string',
    role:                 'string',
    coverVideo:           'string | null',
    coverVideoThumbnail:  'string | null',
    usedCategories:       'string[]',
};

// ─── Enum Values ──────────────────────────────────────────────────────────────

/** Valid values for `status` field */
export const USER_STATUS = [
    'not looking',
    'open to opportunities',
    'actively looking',
];

/** Valid values for `role` field */
export const USER_ROLES = ['manager', 'user', 'client'];

// ─── Example Response ─────────────────────────────────────────────────────────

export const BASIC_INFO_EXAMPLE = {
    username:             'johndoe',
    name:                 'John Doe',
    email:                'john@example.com',
    phoneNumber:          '+62 812 3456 7890',
    profesional:          'Fullstack Developer',
    deskription:          'Passionate developer with 5 years of experience.',
    photo:                'https://cdn.example.com/photos/johndoe.jpg',
    city:                 'Jakarta',
    address:              null,
    country:              'Indonesia',
    state:                'DKI Jakarta',
    status:               'open to opportunities',
    role:                 'user',
    coverVideo:           'https://cdn.example.com/videos/johndoe-cover.mp4',
    coverVideoThumbnail:  'https://cdn.example.com/videos/johndoe-thumb.jpg',
    usedCategories:       ['Web App', 'Mobile', 'UI/UX'],
};
