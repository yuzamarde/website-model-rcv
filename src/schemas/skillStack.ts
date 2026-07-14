/**
 * SKILL STACK — Response Shape
 *
 * Endpoint: GET /api/public/user/id/:userId/skills
 * Cache TTL: 5 minutes. Sorted by `order` ascending (`_id` tiebreak).
 *
 * Each item is a category (e.g. "Frontend") with a list of skills.
 */
import { z } from 'zod';

export const SKILL_PROFICIENCY_VALUES = ['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const;
export type SkillProficiency = (typeof SKILL_PROFICIENCY_VALUES)[number];

export const SkillCategorySchema = z.object({
    _id: z.string(),
    name: z.string().nullable(),
});

export const SkillStackItemSchema = z.object({
    _id: z.string(),
    category: SkillCategorySchema,
    skills: z.array(z.string()),
    order: z.number(),
    proficiency: z.enum(SKILL_PROFICIENCY_VALUES).nullable(),
    yearsOfExperience: z.number().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const SkillStackSchema = z.array(SkillStackItemSchema);

export type SkillCategory = z.infer<typeof SkillCategorySchema>;
export type SkillStackItem = z.infer<typeof SkillStackItemSchema>;
export type SkillStack = z.infer<typeof SkillStackSchema>;

export const SKILL_STACK_EXAMPLE: SkillStack = [
    {
        _id: '64f1a2b3c4d5e6f7a8b9c0da',
        category: { _id: '64f1a2b3c4d5e6f7a8b9c0e4', name: 'Frontend' },
        skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
        order: 1,
        proficiency: 'Advanced',
        yearsOfExperience: 4,
        createdAt: '2024-01-10T09:00:00.000Z',
        updatedAt: '2024-01-10T09:00:00.000Z',
    },
    {
        _id: '64f1a2b3c4d5e6f7a8b9c0db',
        category: { _id: '64f1a2b3c4d5e6f7a8b9c0e5', name: 'Backend' },
        skills: ['Node.js', 'Express', 'MongoDB', 'Redis'],
        order: 2,
        proficiency: 'Intermediate',
        yearsOfExperience: 3,
        createdAt: '2024-01-10T09:00:00.000Z',
        updatedAt: '2024-01-10T09:00:00.000Z',
    },
];
