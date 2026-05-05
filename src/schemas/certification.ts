/**
 * CERTIFICATION — Response Shape
 *
 * Endpoint: GET /api/public/user/id/:userId/certification
 * Cache TTL: 5 minutes. Sorted by `order` ascending.
 */
import { z } from 'zod';

export const CertificationItemSchema = z.object({
    _id: z.string(),
    publisher: z.string(),
    name: z.string(),
    description: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    url: z.string(),
    image: z.string(),
    pdf: z.string(),
    order: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const CertificationSchema = z.array(CertificationItemSchema);

export type CertificationItem = z.infer<typeof CertificationItemSchema>;
export type Certification = z.infer<typeof CertificationSchema>;

export const CERTIFICATION_EXAMPLE: Certification = [
    {
        _id: '64f1a2b3c4d5e6f7a8b9c0d2',
        publisher: 'Google',
        name: 'Google Professional Cloud Developer',
        description: 'Validates ability to build and deploy applications on Google Cloud.',
        startDate: '2023-06-01',
        endDate: '2025-06-01',
        url: 'https://cloud.google.com/certification/verify/ABC123',
        image: 'https://cdn.example.com/certs/gcp-dev.png',
        pdf: 'https://cdn.example.com/certs/gcp-dev.pdf',
        order: 1,
        createdAt: '2024-01-10T09:00:00.000Z',
        updatedAt: '2024-01-10T09:00:00.000Z',
    },
];
