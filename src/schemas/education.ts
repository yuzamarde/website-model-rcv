/**
 * EDUCATION — Response Shape
 *
 * Endpoint: GET /api/public/user/id/:userId/education
 * Cache TTL: 5 minutes.
 *
 * Returns an array of education records, sorted by most recent.
 */
import { z } from 'zod';

export const EDUCATION_DEGREES = [
    'Primary School',
    'Junior High School',
    'Senior High School',
    'Diploma',
    "Bachelor's Degree",
    "Master's Degree",
    'Doctorate (PhD)',
] as const;
export type EducationDegree = (typeof EDUCATION_DEGREES)[number];

export const EducationItemSchema = z.object({
    _id: z.string(),
    degree: z.enum(EDUCATION_DEGREES),
    fieldOfStudy: z.string(),
    institution: z.string(),
    startDate: z.string().nullable(),
    endDate: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const EducationSchema = z.array(EducationItemSchema);

export type EducationItem = z.infer<typeof EducationItemSchema>;
export type Education = z.infer<typeof EducationSchema>;

export const EDUCATION_EXAMPLE: Education = [
    {
        _id: '64f1a2b3c4d5e6f7a8b9c0d1',
        degree: "Bachelor's Degree",
        fieldOfStudy: 'Computer Science',
        institution: 'University of Indonesia',
        startDate: '2018-08-01T00:00:00.000Z',
        endDate: '2022-07-31T00:00:00.000Z',
        createdAt: '2024-01-10T09:00:00.000Z',
        updatedAt: '2024-01-10T09:00:00.000Z',
    },
];
