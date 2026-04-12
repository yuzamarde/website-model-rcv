/**
 * website-model-rcv
 * =================
 * Source-of-truth response shapes for the Porto public portfolio website API.
 *
 * Import the shape constants and enum values you need when building a
 * website template that consumes the /api/public/user/* endpoints.
 *
 * Usage:
 *   import { BASIC_INFO_SHAPE, EDUCATION_DEGREES } from 'website-model-rcv';
 */

// ─── Response Shapes ──────────────────────────────────────────────────────────
export { BASIC_INFO_SHAPE, USER_STATUS, USER_ROLES, BASIC_INFO_EXAMPLE }
    from './schemas/basicInfo.js';

export { EDUCATION_SHAPE, EDUCATION_DEGREES, EDUCATION_EXAMPLE }
    from './schemas/education.js';

export { CERTIFICATION_SHAPE, CERTIFICATION_EXAMPLE }
    from './schemas/certification.js';

export { EXPERIENCE_SHAPE, POSITION_SHAPE, EXPERIENCE_CONTRACT_TYPES, EXPERIENCE_TYPE_WORK, EXPERIENCE_EXAMPLE }
    from './schemas/experience.js';

export { SOCIAL_ACCOUNT_SHAPE, SOCIAL_PLATFORM_SHAPE, SOCIAL_ACCOUNT_EXAMPLE }
    from './schemas/socialAccount.js';

export {
    LANGUAGE_SHAPE,
    LANGUAGE_PROFICIENCY_LEVELS,
    LANGUAGE_CODES,
    LANGUAGE_MAP,
    LANGUAGE_NATIVE_MAP,
    LANGUAGE_EXAMPLE,
} from './schemas/language.js';

export {
    PORTFOLIO_SHAPE,
    PORTFOLIO_CATEGORY_SHAPE,
    PORTFOLIO_STATUS_VALUES,
    PORTFOLIO_EXAMPLE,
} from './schemas/portfolio.js';

export {
    SKILL_STACK_SHAPE,
    SKILL_CATEGORY_SHAPE,
    SKILL_PROFICIENCY_VALUES,
    SKILL_STACK_EXAMPLE,
} from './schemas/skillStack.js';

export { META_SHAPE, META_EXAMPLE }
    from './schemas/meta.js';

export { SITEMAP_SHAPE, SITEMAP_SECTIONS, SITEMAP_EXAMPLE }
    from './schemas/sitemap.js';
