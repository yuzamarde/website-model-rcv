/**
 * ============================================
 * LANGUAGE — Response Shape
 * ============================================
 *
 * Endpoint:
 *   GET /api/public/user/id/:userId/languages
 *
 * Formatter: formatLanguages → formatLanguage[]
 * Cache TTL: 5 minutes
 *
 * Returns an array of language proficiency records.
 * Language codes are mapped to display names and native names automatically.
 */

/**
 * @typedef {Object} LanguageItem
 * @property {string} _id             - MongoDB ObjectId string
 * @property {string} language        - Display name (e.g., "Indonesian")
 * @property {string} languageCode    - ISO 639-1 code (e.g., "id")
 * @property {string} languageNative  - Native script name (e.g., "Bahasa Indonesia")
 * @property {string} listening       - Listening level (see LANGUAGE_PROFICIENCY_LEVELS)
 * @property {string} speaking        - Speaking level (see LANGUAGE_PROFICIENCY_LEVELS)
 * @property {string} writing         - Writing level (see LANGUAGE_PROFICIENCY_LEVELS)
 * @property {number} order           - Display order (ascending, default 0)
 * @property {string} createdAt       - ISO 8601
 * @property {string} updatedAt       - ISO 8601
 */

export const LANGUAGE_SHAPE = {
    _id:            'string',
    language:       'string',
    languageCode:   'string',
    languageNative: 'string',
    listening:      'string',
    speaking:       'string',
    writing:        'string',
    order:          'number',
    createdAt:      'string',
    updatedAt:      'string',
};

// ─── Enum Values ──────────────────────────────────────────────────────────────

/** Valid values for `listening`, `speaking`, `writing` fields */
export const LANGUAGE_PROFICIENCY_LEVELS = ['native', 'fluent', 'intermediate', 'basic'];

/** Supported language codes (ISO 639-1) */
export const LANGUAGE_CODES = [
    'ar', 'bn', 'yue', 'zh', 'nl', 'en', 'fr', 'de',
    'hi', 'id', 'it', 'ja', 'jv', 'ko', 'ms', 'pt',
    'ru', 'es', 'th', 'tr', 'vi',
];

/** Language code → English display name */
export const LANGUAGE_MAP = {
    ar:  'Arabic',     bn:  'Bengali',    yue: 'Cantonese',   zh:  'Chinese',
    nl:  'Dutch',      en:  'English',    fr:  'French',      de:  'German',
    hi:  'Hindi',      id:  'Indonesian', it:  'Italian',     ja:  'Japanese',
    jv:  'Javanese',   ko:  'Korean',     ms:  'Malay',       pt:  'Portuguese',
    ru:  'Russian',    es:  'Spanish',    th:  'Thai',         tr:  'Turkish',
    vi:  'Vietnamese',
};

/** Language code → Native script name */
export const LANGUAGE_NATIVE_MAP = {
    ar:  'العربية',          bn:  'বাংলা',           yue: '粵語',
    zh:  '简体中文',           nl:  'Nederlands',      en:  'English',
    fr:  'Français',         de:  'Deutsch',          hi:  'हिन्दी',
    id:  'Bahasa Indonesia', it:  'Italiano',         ja:  '日本語',
    jv:  'Basa Jawa',        ko:  '한국어',            ms:  'Bahasa Melayu',
    pt:  'Português',        ru:  'Русский',          es:  'Español',
    th:  'ไทย',              tr:  'Türkçe',           vi:  'Tiếng Việt',
};

// ─── Example Response ─────────────────────────────────────────────────────────

export const LANGUAGE_EXAMPLE = [
    {
        _id:            '64f1a2b3c4d5e6f7a8b9c0d7',
        language:       'Indonesian',
        languageCode:   'id',
        languageNative: 'Bahasa Indonesia',
        listening:      'native',
        speaking:       'native',
        writing:        'native',
        order:          1,
        createdAt:      '2024-01-10T09:00:00.000Z',
        updatedAt:      '2024-01-10T09:00:00.000Z',
    },
    {
        _id:            '64f1a2b3c4d5e6f7a8b9c0d8',
        language:       'English',
        languageCode:   'en',
        languageNative: 'English',
        listening:      'fluent',
        speaking:       'intermediate',
        writing:        'fluent',
        order:          2,
        createdAt:      '2024-01-10T09:00:00.000Z',
        updatedAt:      '2024-01-10T09:00:00.000Z',
    },
];
