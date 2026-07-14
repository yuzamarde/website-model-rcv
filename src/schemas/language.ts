/**
 * LANGUAGE — Response Shape
 *
 * Endpoint: GET /api/public/user/id/:userId/languages
 * Cache TTL: 5 minutes. Sorted by `order` ascending (`_id` tiebreak).
 *
 * Language codes are mapped to display names and native names automatically.
 */
import { z } from 'zod';

export const LANGUAGE_PROFICIENCY_LEVELS = ['native', 'fluent', 'intermediate', 'basic'] as const;
export type LanguageProficiency = (typeof LANGUAGE_PROFICIENCY_LEVELS)[number];

export const LANGUAGE_CODES = [
    'ar', 'bn', 'yue', 'zh', 'nl', 'en', 'fr', 'de',
    'hi', 'id', 'it', 'ja', 'jv', 'ko', 'ms', 'pt',
    'ru', 'es', 'th', 'tr', 'vi',
] as const;
export type LanguageCode = (typeof LANGUAGE_CODES)[number];

export const LANGUAGE_MAP: Record<LanguageCode, string> = {
    ar: 'Arabic', bn: 'Bengali', yue: 'Cantonese', zh: 'Chinese',
    nl: 'Dutch', en: 'English', fr: 'French', de: 'German',
    hi: 'Hindi', id: 'Indonesian', it: 'Italian', ja: 'Japanese',
    jv: 'Javanese', ko: 'Korean', ms: 'Malay', pt: 'Portuguese',
    ru: 'Russian', es: 'Spanish', th: 'Thai', tr: 'Turkish',
    vi: 'Vietnamese',
};

export const LANGUAGE_NATIVE_MAP: Record<LanguageCode, string> = {
    ar: 'العربية', bn: 'বাংলা', yue: '粵語',
    zh: '简体中文', nl: 'Nederlands', en: 'English',
    fr: 'Français', de: 'Deutsch', hi: 'हिन्दी',
    id: 'Bahasa Indonesia', it: 'Italiano', ja: '日本語',
    jv: 'Basa Jawa', ko: '한국어', ms: 'Bahasa Melayu',
    pt: 'Português', ru: 'Русский', es: 'Español',
    th: 'ไทย', tr: 'Türkçe', vi: 'Tiếng Việt',
};

export const LanguageItemSchema = z.object({
    _id: z.string(),
    language: z.string(),
    languageCode: z.string(),
    languageNative: z.string(),
    listening: z.enum(LANGUAGE_PROFICIENCY_LEVELS),
    speaking: z.enum(LANGUAGE_PROFICIENCY_LEVELS),
    writing: z.enum(LANGUAGE_PROFICIENCY_LEVELS),
    order: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const LanguageSchema = z.array(LanguageItemSchema);

export type LanguageItem = z.infer<typeof LanguageItemSchema>;
export type Language = z.infer<typeof LanguageSchema>;

export const LANGUAGE_EXAMPLE: Language = [
    {
        _id: '64f1a2b3c4d5e6f7a8b9c0d7',
        language: 'Indonesian',
        languageCode: 'id',
        languageNative: 'Bahasa Indonesia',
        listening: 'native',
        speaking: 'native',
        writing: 'native',
        order: 1,
        createdAt: '2024-01-10T09:00:00.000Z',
        updatedAt: '2024-01-10T09:00:00.000Z',
    },
    {
        _id: '64f1a2b3c4d5e6f7a8b9c0d8',
        language: 'English',
        languageCode: 'en',
        languageNative: 'English',
        listening: 'fluent',
        speaking: 'intermediate',
        writing: 'fluent',
        order: 2,
        createdAt: '2024-01-10T09:00:00.000Z',
        updatedAt: '2024-01-10T09:00:00.000Z',
    },
];
