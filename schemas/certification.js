/**
 * ============================================
 * CERTIFICATION — Response Shape
 * ============================================
 *
 * Endpoint:
 *   GET /api/public/user/id/:userId/certification
 *
 * Formatter: formatCertifications → formatCertification[]
 * Cache TTL: 5 minutes
 *
 * Returns an array of certification records, sorted by `order` field.
 */

/**
 * @typedef {Object} CertificationItem
 * @property {string}      _id         - MongoDB ObjectId string
 * @property {string}      publisher   - Issuing organization
 * @property {string}      name        - Certification name
 * @property {string}      description - Description / summary
 * @property {string}      startDate   - Issue date (raw string from DB)
 * @property {string}      endDate     - Expiry date (raw string from DB)
 * @property {string}      url         - Credential URL / verification link
 * @property {string}      image       - Certification badge / image URL
 * @property {string}      pdf         - PDF credential URL
 * @property {number}      order       - Display order (ascending)
 * @property {string}      createdAt   - Record creation timestamp (ISO 8601)
 * @property {string}      updatedAt   - Last update timestamp (ISO 8601)
 */

export const CERTIFICATION_SHAPE = {
    _id:         'string',
    publisher:   'string',
    name:        'string',
    description: 'string',
    startDate:   'string',
    endDate:     'string',
    url:         'string',
    image:       'string',
    pdf:         'string',
    order:       'number',
    createdAt:   'string',
    updatedAt:   'string',
};

// ─── Example Response ─────────────────────────────────────────────────────────

export const CERTIFICATION_EXAMPLE = [
    {
        _id:         '64f1a2b3c4d5e6f7a8b9c0d2',
        publisher:   'Google',
        name:        'Google Professional Cloud Developer',
        description: 'Validates ability to build and deploy applications on Google Cloud.',
        startDate:   '2023-06-01',
        endDate:     '2025-06-01',
        url:         'https://cloud.google.com/certification/verify/ABC123',
        image:       'https://cdn.example.com/certs/gcp-dev.png',
        pdf:         'https://cdn.example.com/certs/gcp-dev.pdf',
        order:       1,
        createdAt:   '2024-01-10T09:00:00.000Z',
        updatedAt:   '2024-01-10T09:00:00.000Z',
    },
];
