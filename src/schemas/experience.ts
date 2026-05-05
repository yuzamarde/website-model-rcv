/**
 * EXPERIENCE — Response Shape
 *
 * Endpoint: GET /api/public/user/id/:userId/experience
 * Cache TTL: 5 minutes.
 *
 * Each company can have multiple positions (e.g., promoted from junior to senior).
 */
import { z } from 'zod';

export const EXPERIENCE_CONTRACT_TYPES = ['Full time', 'Part time', 'Internship'] as const;
export type ExperienceContractType = (typeof EXPERIENCE_CONTRACT_TYPES)[number];

export const EXPERIENCE_TYPE_WORK = ['Remote', 'Onsite', 'Hybrid'] as const;
export type ExperienceTypeWork = (typeof EXPERIENCE_TYPE_WORK)[number];

export const PositionSchema = z.object({
    _id: z.string(),
    jobTitle: z.string(),
    contract: z.enum(EXPERIENCE_CONTRACT_TYPES),
    typeWork: z.enum(EXPERIENCE_TYPE_WORK),
    startDate: z.string().nullable(),
    endDate: z.string().nullable(),
    description: z.string(),
    details: z.array(z.string()),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const ExperienceItemSchema = z.object({
    _id: z.string(),
    companyName: z.string(),
    address: z.string().nullable(),
    city: z.string().nullable(),
    state: z.string().nullable(),
    country: z.string(),
    webUrl: z.string().nullable(),
    positions: z.array(PositionSchema),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const ExperienceSchema = z.array(ExperienceItemSchema);

export type Position = z.infer<typeof PositionSchema>;
export type ExperienceItem = z.infer<typeof ExperienceItemSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;

export const EXPERIENCE_EXAMPLE: Experience = [
    {
        _id: '64f1a2b3c4d5e6f7a8b9c0d3',
        companyName: 'Acme Corp',
        address: null,
        city: 'Jakarta',
        state: null,
        country: 'Indonesia',
        webUrl: 'https://acme.com',
        positions: [
            {
                _id: '64f1a2b3c4d5e6f7a8b9c0d4',
                jobTitle: 'Senior Frontend Developer',
                contract: 'Full time',
                typeWork: 'Hybrid',
                startDate: '2022-03-01T00:00:00.000Z',
                endDate: null,
                description: 'Lead frontend development for the core product.',
                details: [
                    'Built reusable component library with React',
                    'Improved page load speed by 40%',
                ],
                createdAt: '2024-01-10T09:00:00.000Z',
                updatedAt: '2024-01-10T09:00:00.000Z',
            },
        ],
        createdAt: '2024-01-10T09:00:00.000Z',
        updatedAt: '2024-01-10T09:00:00.000Z',
    },
];
