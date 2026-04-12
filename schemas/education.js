/**
 * ============================================
 * EDUCATION — Response Shape
 * ============================================
 *
 * Endpoint:
 *   GET /api/public/user/id/:userId/education
 *
 * Formatter: formatEducations → formatEducation[]
 * Cache TTL: 5 minutes
 *
 * Returns an array of education records, sorted by most recent.
 */

/**
 * @typedef {Object} EducationItem
 * @property {string}      _id           - MongoDB ObjectId string
 * @property {string}      degree        - Degree level (see EDUCATION_DEGREES)
 * @property {string}      fieldOfStudy  - Field of study / major
 * @property {string}      institution   - School / university name
 * @property {string|null} startDate     - Start date (ISO 8601) or null
 * @property {string|null} endDate       - End date (ISO 8601) or null (ongoing if null)
 * @property {string}      createdAt     - Record creation timestamp (ISO 8601)
 * @property {string}      updatedAt     - Last update timestamp (ISO 8601)
 */

export const EDUCATION_SHAPE = {
    _id:          'string',
    degree:       'string',
    fieldOfStudy: 'string',
    institution:  'string',
    startDate:    'string | null',
    endDate:      'string | null',
    createdAt:    'string',
    updatedAt:    'string',
};

// ─── Enum Values ──────────────────────────────────────────────────────────────

/** Valid values for `degree` field */
export const EDUCATION_DEGREES = [
    'Primary School',
    'Junior High School',
    'Senior High School',
    'Diploma',
    "Bachelor's Degree",
    "Master's Degree",
    'Doctorate (PhD)',
];

// ─── Example Response ─────────────────────────────────────────────────────────

export const EDUCATION_EXAMPLE = [
    {
        _id:          '64f1a2b3c4d5e6f7a8b9c0d1',
        degree:       "Bachelor's Degree",
        fieldOfStudy: 'Computer Science',
        institution:  'University of Indonesia',
        startDate:    '2018-08-01T00:00:00.000Z',
        endDate:      '2022-07-31T00:00:00.000Z',
        createdAt:    '2024-01-10T09:00:00.000Z',
        updatedAt:    '2024-01-10T09:00:00.000Z',
    },
];
