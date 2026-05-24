/**
 * BASIC INFO — Response Shape (v3.0.0 BREAKING — Phase 11, 2026-05-25)
 *
 * Endpoint:
 *   GET /api/public/user/site/:apiKey/basic
 *
 * Cache TTL: 5 minutes.
 * Visitor tracking: porto-rs `track_basic` middleware + porto-be `trackVisitor`
 * middleware persist visitor record per request (RFC 0014).
 *
 * v3.0.0 BREAKING changes from v2.x:
 *   - DROPPED: `username`, `status`, `role` (no longer surfaced publicly)
 *   - ADDED:   `postalCode`, `gender`, `legalEntityName`
 *   - RENAMED: `profesional` → `professional` (typo fix)
 *   - RENAMED: `deskription` → `description` (typo fix)
 *   - DELETED: `/api/public/user/site/:apiKey/profile` endpoint (this is the
 *     sole canonical public-website shape now; Profile shape merged into Basic)
 *
 * Privacy mask: when `sharePersonalInfo === false` server-side, the 4 fields
 * `phoneNumber`, `city`, `address`, `postalCode` are nulled before serialization.
 * `gender`, `legalEntityName`, `state`, `country`, `email` always retained.
 */
import { z } from 'zod';

export const BasicInfoSchema = z.object({
    name: z.string().nullable(),
    email: z.string().nullable(),
    phoneNumber: z.string().nullable(),
    professional: z.string().nullable(),
    description: z.string().nullable(),
    photo: z.string().nullable(),
    postalCode: z.string().nullable(),
    address: z.string().nullable(),
    city: z.string().nullable(),
    state: z.string().nullable(),
    country: z.string().nullable(),
    gender: z.string().nullable(),
    coverVideo: z.string().nullable(),
    coverVideoThumbnail: z.string().nullable(),
    legalEntityName: z.string().nullable(),
    usedCategories: z.array(z.string()),
});

export type BasicInfo = z.infer<typeof BasicInfoSchema>;

export const BASIC_INFO_EXAMPLE: BasicInfo = {
    name: 'John Doe',
    email: 'john@example.com',
    phoneNumber: '+62 812 3456 7890',
    professional: 'Fullstack Developer',
    description: 'Passionate developer with 5 years of experience.',
    photo: 'https://cdn.example.com/photos/johndoe.jpg',
    postalCode: '12345',
    address: 'Jl. Sudirman No. 1',
    city: 'Jakarta',
    state: 'DKI Jakarta',
    country: 'Indonesia',
    gender: 'Male',
    coverVideo: 'https://cdn.example.com/videos/johndoe-cover.mp4',
    coverVideoThumbnail: 'https://cdn.example.com/videos/johndoe-thumb.jpg',
    legalEntityName: 'John Doe Studio',
    usedCategories: ['Web App', 'Mobile', 'UI/UX'],
};
