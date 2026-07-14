/**
 * SOCIAL ACCOUNT — Response Shape
 *
 * Endpoint: GET /api/public/user/id/:userId/social
 * Cache TTL: 5 minutes. Sorted by `order` ascending (`_id` tiebreak).
 *
 * `social` is the populated platform info (name + URL pattern).
 */
import { z } from 'zod';

export const SocialPlatformSchema = z.object({
    _id: z.string(),
    name: z.string(),
    path: z.string(),
});

export const SocialAccountItemSchema = z.object({
    _id: z.string(),
    name: z.string(),
    url: z.string(),
    social: SocialPlatformSchema,
    order: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const SocialAccountSchema = z.array(SocialAccountItemSchema);

export type SocialPlatform = z.infer<typeof SocialPlatformSchema>;
export type SocialAccountItem = z.infer<typeof SocialAccountItemSchema>;
export type SocialAccount = z.infer<typeof SocialAccountSchema>;

export const SOCIAL_ACCOUNT_EXAMPLE: SocialAccount = [
    {
        _id: '64f1a2b3c4d5e6f7a8b9c0d5',
        name: 'johndoe',
        url: 'https://github.com/johndoe',
        social: {
            _id: '64f1a2b3c4d5e6f7a8b9c0e1',
            name: 'GitHub',
            path: 'https://github.com/',
        },
        order: 1,
        createdAt: '2024-01-10T09:00:00.000Z',
        updatedAt: '2024-01-10T09:00:00.000Z',
    },
    {
        _id: '64f1a2b3c4d5e6f7a8b9c0d6',
        name: 'John Doe',
        url: 'https://linkedin.com/in/johndoe',
        social: {
            _id: '64f1a2b3c4d5e6f7a8b9c0e2',
            name: 'LinkedIn',
            path: 'https://linkedin.com/in/',
        },
        order: 2,
        createdAt: '2024-01-10T09:00:00.000Z',
        updatedAt: '2024-01-10T09:00:00.000Z',
    },
];
