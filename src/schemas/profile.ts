/**
 * PROFILE — Canonical public User Profile shape (RFC 0016).
 *
 * Source of truth for public-facing User Profile data. porto-rs reads via
 * strict Mongo projection (NEVER returns password/apiKeys/role). 4 templates
 * consume `Profile` type via website-model-rcv npm pin. porto-be formatter
 * `formatWebsiteUserProfile` derives from the `USER_WEBSITE_PROFILE_FIELDS`
 * allowlist (`porto-be/src/contracts/definitions/userProfile.js`).
 *
 * Distinction from `basicInfo.ts`:
 *   • basicInfo = legacy shape, still served by `/site/:apiKey/basic` for
 *     backward compat. Includes `role` (auth-leak) + `usedCategories` (derived).
 *   • profile = clean shape, no auth fields. Forward-going canonical. Future
 *     endpoint may serve at `/site/:apiKey/profile`; for now it's the
 *     canonical type templates can opt into via
 *     `import type { Profile } from 'website-model-rcv'`.
 *
 * Privacy mask: phoneNumber, address, city, state, country may be null when
 * `sharePersonalInfo === false`. porto-rs `privacy::apply_mask` nulls those
 * AFTER decryption + BEFORE formatter.
 */
import { z } from 'zod';
import { USER_STATUS } from './basicInfo.js';

export const ProfileSchema = z.object({
    userId: z.string(),
    username: z.string(),
    name: z.string().nullable(),
    email: z.string().nullable(),                    // CONTACT email (may differ from login)
    profesional: z.string().nullable(),
    deskription: z.string().nullable(),
    photo: z.string().nullable(),
    city: z.string().nullable(),
    address: z.string().nullable(),
    country: z.string().nullable(),
    state: z.string().nullable(),
    postalCode: z.string().nullable(),
    phoneNumber: z.string().nullable(),              // privacy-masked when sharePersonalInfo=false
    status: z.enum(USER_STATUS),
    statusUpdatedAt: z.string().nullable(),          // ISO 8601 string
    birthdate: z.string().nullable(),
    gender: z.string().nullable(),
    coverVideo: z.string().nullable(),
    coverVideoThumbnail: z.string().nullable(),
    userWebsite: z.string().nullable(),
    legalEntityName: z.string().nullable(),
    sharePersonalInfo: z.boolean(),
});

export type Profile = z.infer<typeof ProfileSchema>;

export const PROFILE_EXAMPLE: Profile = {
    userId: '0f2b5534-6f72-4ee9-ae38-347e8e0cd48f',
    username: 'johndoe',
    name: 'John Doe',
    email: 'contact@johndoe.com',
    profesional: 'Fullstack Developer',
    deskription: 'Passionate developer with 5 years of experience.',
    photo: 'https://cdn.example.com/photos/johndoe.jpg',
    city: 'Jakarta',
    address: null,
    country: 'Indonesia',
    state: 'DKI Jakarta',
    postalCode: '12345',
    phoneNumber: '+62 812 3456 7890',
    status: 'open to opportunities',
    statusUpdatedAt: '2026-05-23T10:30:00.000Z',
    birthdate: '1995-06-15',
    gender: 'Male',
    coverVideo: 'https://cdn.example.com/videos/johndoe-cover.mp4',
    coverVideoThumbnail: 'https://cdn.example.com/videos/johndoe-thumb.jpg',
    userWebsite: 'https://johndoe.dev',
    legalEntityName: null,
    sharePersonalInfo: true,
};
