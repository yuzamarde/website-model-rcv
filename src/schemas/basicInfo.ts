/**
 * BASIC INFO — Response Shape
 *
 * Endpoints:
 *   GET /api/public/user/id/:userId/basic
 *   GET /api/public/user/:username
 *
 * Cache TTL: 5 minutes.
 * Privacy mask: email, phoneNumber, address, city, state, country may be
 * null when the user has disabled `sharePersonalInfo`.
 */
import { z } from 'zod';

export const USER_STATUS = [
    'not looking',
    'open to opportunities',
    'actively looking',
] as const;
export type UserStatus = (typeof USER_STATUS)[number];

export const USER_ROLES = ['manager', 'user', 'client'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const BasicInfoSchema = z.object({
    username: z.string(),
    name: z.string(),
    email: z.string().nullable(),
    phoneNumber: z.string().nullable(),
    profesional: z.string().nullable(),
    deskription: z.string().nullable(),
    photo: z.string().nullable(),
    city: z.string().nullable(),
    address: z.string().nullable(),
    country: z.string().nullable(),
    state: z.string().nullable(),
    status: z.enum(USER_STATUS),
    role: z.enum(USER_ROLES),
    coverVideo: z.string().nullable(),
    coverVideoThumbnail: z.string().nullable(),
    usedCategories: z.array(z.string()),
});

export type BasicInfo = z.infer<typeof BasicInfoSchema>;

export const BASIC_INFO_EXAMPLE: BasicInfo = {
    username: 'johndoe',
    name: 'John Doe',
    email: 'john@example.com',
    phoneNumber: '+62 812 3456 7890',
    profesional: 'Fullstack Developer',
    deskription: 'Passionate developer with 5 years of experience.',
    photo: 'https://cdn.example.com/photos/johndoe.jpg',
    city: 'Jakarta',
    address: null,
    country: 'Indonesia',
    state: 'DKI Jakarta',
    status: 'open to opportunities',
    role: 'user',
    coverVideo: 'https://cdn.example.com/videos/johndoe-cover.mp4',
    coverVideoThumbnail: 'https://cdn.example.com/videos/johndoe-thumb.jpg',
    usedCategories: ['Web App', 'Mobile', 'UI/UX'],
};
