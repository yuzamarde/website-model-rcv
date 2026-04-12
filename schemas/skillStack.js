/**
 * ============================================
 * SKILL STACK — Response Shape
 * ============================================
 *
 * Endpoint:
 *   GET /api/public/user/id/:userId/skills
 *
 * Formatter: formatSkillStacks → formatSkillStack[]
 * Cache TTL: 5 minutes
 *
 * Returns an array of skill stack groups.
 * Each skill stack is a category (e.g., "Frontend") with a list of skills.
 */

/**
 * @typedef {Object} SkillCategory
 * @property {string}      _id  - Category ObjectId string
 * @property {string|null} name - Category display name
 */

/**
 * @typedef {Object} SkillStackItem
 * @property {string}       _id               - MongoDB ObjectId string
 * @property {SkillCategory} category          - Populated category object
 * @property {string[]}     skills             - List of skill names in this group
 * @property {number}       order              - Display order (ascending, default 0)
 * @property {string|null}  proficiency        - Overall proficiency level (see SKILL_PROFICIENCY_VALUES)
 * @property {number|null}  yearsOfExperience  - Years of experience with this skill group
 * @property {string}       createdAt          - ISO 8601
 * @property {string}       updatedAt          - ISO 8601
 */

export const SKILL_CATEGORY_SHAPE = {
    _id:  'string',
    name: 'string | null',
};

export const SKILL_STACK_SHAPE = {
    _id:              'string',
    category:         'SkillCategory',
    skills:           'string[]',
    order:            'number',
    proficiency:      'string | null',
    yearsOfExperience:'number | null',
    createdAt:        'string',
    updatedAt:        'string',
};

// ─── Enum Values ──────────────────────────────────────────────────────────────

/** Valid values for `proficiency` field */
export const SKILL_PROFICIENCY_VALUES = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

// ─── Example Response ─────────────────────────────────────────────────────────

export const SKILL_STACK_EXAMPLE = [
    {
        _id:               '64f1a2b3c4d5e6f7a8b9c0da',
        category:          { _id: '64f1a2b3c4d5e6f7a8b9c0e4', name: 'Frontend' },
        skills:            ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
        order:             1,
        proficiency:       'Advanced',
        yearsOfExperience: 4,
        createdAt:         '2024-01-10T09:00:00.000Z',
        updatedAt:         '2024-01-10T09:00:00.000Z',
    },
    {
        _id:               '64f1a2b3c4d5e6f7a8b9c0db',
        category:          { _id: '64f1a2b3c4d5e6f7a8b9c0e5', name: 'Backend' },
        skills:            ['Node.js', 'Express', 'MongoDB', 'Redis'],
        order:             2,
        proficiency:       'Intermediate',
        yearsOfExperience: 3,
        createdAt:         '2024-01-10T09:00:00.000Z',
        updatedAt:         '2024-01-10T09:00:00.000Z',
    },
];
