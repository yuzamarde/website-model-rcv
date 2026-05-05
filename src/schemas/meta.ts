/**
 * META — Response Shape
 *
 * Endpoint: GET /api/public/user/id/:userId/meta
 * Cache TTL: 1 hour.
 *
 * Used to populate <head> SEO tags and OpenGraph meta. Privacy mask applies:
 * `location` may be empty when sharePersonalInfo is off.
 */
import { z } from 'zod';

export const MetaSchema = z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().nullable(),
    keywords: z.array(z.string()),
    location: z.string(),
    type: z.literal('profile'),
});

export type Meta = z.infer<typeof MetaSchema>;

export const META_EXAMPLE: Meta = {
    title: 'John Doe – Fullstack Developer',
    description: 'Passionate developer with 5 years of experience in web and mobile.',
    image: 'https://cdn.example.com/photos/johndoe.jpg',
    keywords: ['React', 'Next.js', 'Node.js', 'MongoDB', 'TypeScript'],
    location: 'Jakarta, Indonesia',
    type: 'profile',
};
