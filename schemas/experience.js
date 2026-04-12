/**
 * ============================================
 * EXPERIENCE — Response Shape
 * ============================================
 *
 * Endpoint:
 *   GET /api/public/user/id/:userId/experience
 *
 * Formatter: formatExperiences → formatExperience[]
 * Cache TTL: 5 minutes
 *
 * Returns an array of companies, each with a nested `positions` array.
 * One company can have multiple positions (e.g., promoted from junior to senior).
 */

/**
 * @typedef {Object} PositionItem
 * @property {string}      _id         - MongoDB ObjectId string
 * @property {string}      jobTitle    - Job title / role name
 * @property {string}      contract    - Contract type (see EXPERIENCE_CONTRACT_TYPES)
 * @property {string}      typeWork    - Work arrangement (see EXPERIENCE_TYPE_WORK)
 * @property {string|null} startDate   - Start date (ISO 8601) or null
 * @property {string|null} endDate     - End date (ISO 8601) or null (current role if null)
 * @property {string}      description - Role summary
 * @property {string[]}    details     - Bullet-point responsibilities / achievements
 * @property {string}      createdAt   - ISO 8601
 * @property {string}      updatedAt   - ISO 8601
 */

/**
 * @typedef {Object} ExperienceItem
 * @property {string}         _id         - MongoDB ObjectId string
 * @property {string}         companyName - Company / organization name
 * @property {string|null}    address     - Company address (nullable)
 * @property {string|null}    city        - City (nullable)
 * @property {string|null}    state       - State / province (nullable)
 * @property {string}         country     - Country
 * @property {string|null}    webUrl      - Company website URL (nullable)
 * @property {PositionItem[]} positions   - List of positions held at this company
 * @property {string}         createdAt   - ISO 8601
 * @property {string}         updatedAt   - ISO 8601
 */

export const POSITION_SHAPE = {
    _id:         'string',
    jobTitle:    'string',
    contract:    'string',
    typeWork:    'string',
    startDate:   'string | null',
    endDate:     'string | null',
    description: 'string',
    details:     'string[]',
    createdAt:   'string',
    updatedAt:   'string',
};

export const EXPERIENCE_SHAPE = {
    _id:         'string',
    companyName: 'string',
    address:     'string | null',
    city:        'string | null',
    state:       'string | null',
    country:     'string',
    webUrl:      'string | null',
    positions:   'PositionItem[]',
    createdAt:   'string',
    updatedAt:   'string',
};

// ─── Enum Values ──────────────────────────────────────────────────────────────

/** Valid values for `contract` field */
export const EXPERIENCE_CONTRACT_TYPES = ['Full time', 'Part time', 'Internship'];

/** Valid values for `typeWork` field */
export const EXPERIENCE_TYPE_WORK = ['Remote', 'Onsite', 'Hybrid'];

// ─── Example Response ─────────────────────────────────────────────────────────

export const EXPERIENCE_EXAMPLE = [
    {
        _id:         '64f1a2b3c4d5e6f7a8b9c0d3',
        companyName: 'Acme Corp',
        address:     null,
        city:        'Jakarta',
        state:       null,
        country:     'Indonesia',
        webUrl:      'https://acme.com',
        positions: [
            {
                _id:         '64f1a2b3c4d5e6f7a8b9c0d4',
                jobTitle:    'Senior Frontend Developer',
                contract:    'Full time',
                typeWork:    'Hybrid',
                startDate:   '2022-03-01T00:00:00.000Z',
                endDate:     null,
                description: 'Lead frontend development for the core product.',
                details: [
                    'Built reusable component library with React',
                    'Improved page load speed by 40%',
                ],
                createdAt:   '2024-01-10T09:00:00.000Z',
                updatedAt:   '2024-01-10T09:00:00.000Z',
            },
        ],
        createdAt:   '2024-01-10T09:00:00.000Z',
        updatedAt:   '2024-01-10T09:00:00.000Z',
    },
];
