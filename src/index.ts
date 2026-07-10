/**
 * website-model-rcv
 * =================
 * TypeScript + Zod response contracts for the Porto public portfolio website API.
 *
 * Each schema is a Zod object — call `.parse(data)` for runtime validation,
 * or `import type { ... }` for compile-time types via `z.infer`.
 *
 *   import { BasicInfoSchema, type BasicInfo } from 'website-model-rcv';
 *
 *   const res = await fetch('/api/public/user/id/<id>/basic').then(r => r.json());
 *   const info: BasicInfo = BasicInfoSchema.parse(res.data);
 */

export { apiEnvelope, type ApiEnvelope } from './envelope.js';

// BasicInfo v3.0.0 (Phase 11, 2026-05-25) — single canonical public-website
// shape. Profile schema deleted; /profile endpoint deleted; USER_STATUS +
// USER_ROLES enums dropped from public exposure (status/role no longer
// surfaced via /basic).
export {
    BasicInfoSchema,
    BASIC_INFO_EXAMPLE,
    type BasicInfo,
} from './schemas/basicInfo.js';

export {
    EducationSchema,
    EducationItemSchema,
    EDUCATION_DEGREES,
    EDUCATION_EXAMPLE,
    type Education,
    type EducationItem,
    type EducationDegree,
} from './schemas/education.js';

export {
    CertificationSchema,
    CertificationItemSchema,
    CERTIFICATION_EXAMPLE,
    type Certification,
    type CertificationItem,
} from './schemas/certification.js';

export {
    ExperienceSchema,
    ExperienceItemSchema,
    PositionSchema,
    EXPERIENCE_CONTRACT_TYPES,
    EXPERIENCE_TYPE_WORK,
    EXPERIENCE_EXAMPLE,
    type Experience,
    type ExperienceItem,
    type Position,
    type ExperienceContractType,
    type ExperienceTypeWork,
} from './schemas/experience.js';

export {
    SocialAccountSchema,
    SocialAccountItemSchema,
    SocialPlatformSchema,
    SOCIAL_ACCOUNT_EXAMPLE,
    type SocialAccount,
    type SocialAccountItem,
    type SocialPlatform,
} from './schemas/socialAccount.js';

export {
    LanguageSchema,
    LanguageItemSchema,
    LANGUAGE_PROFICIENCY_LEVELS,
    LANGUAGE_CODES,
    LANGUAGE_MAP,
    LANGUAGE_NATIVE_MAP,
    LANGUAGE_EXAMPLE,
    type Language,
    type LanguageItem,
    type LanguageProficiency,
    type LanguageCode,
} from './schemas/language.js';

export {
    // DETAIL endpoint shapes (/portfolio/:id) — full 24-field
    PortfolioSchema,
    PortfolioItemSchema,
    PortfolioCategorySchema,
    PortfolioImageBlockSchema,
    PortfolioDescriptionBlockSchema,
    PortfolioContentBlockSchema,
    // Creator credits (RFC-0031) + trust links (RFC-0037, v4.2.0)
    PortfolioCreatorSchema,
    PortfolioPersonRefSchema,
    // LIST endpoint shapes (/portfolio) — Phase 15 v4.0.0 SLIM 12-field
    PortfolioListItemSchema,
    PortfolioListSchema,
    PortfolioListMetaSchema,
    PortfolioListEnvelopeSchema,
    // Shared enums
    PORTFOLIO_STATUS_VALUES,
    PORTFOLIO_VISIBILITY_VALUES,
    PORTFOLIO_BLOCK_TYPES,
    PORTFOLIO_CREATOR_KINDS,
    PORTFOLIO_CLIENT_KINDS,
    // Examples
    PORTFOLIO_EXAMPLE,
    PORTFOLIO_LIST_EXAMPLE,
    PORTFOLIO_LIST_ENVELOPE_EXAMPLE,
    // Types
    type Portfolio,
    type PortfolioItem,
    type PortfolioCategory,
    type PortfolioImageBlock,
    type PortfolioDescriptionBlock,
    type PortfolioContentBlock,
    type PortfolioCreator,
    type PortfolioCreatorKind,
    type PortfolioPersonRef,
    type PortfolioClientKind,
    type PortfolioListItem,
    type PortfolioList,
    type PortfolioListMeta,
    type PortfolioListEnvelope,
    type PortfolioStatus,
    type PortfolioVisibility,
    type PortfolioBlockType,
} from './schemas/portfolio.js';

export {
    SkillStackSchema,
    SkillStackItemSchema,
    SkillCategorySchema,
    SKILL_PROFICIENCY_VALUES,
    SKILL_STACK_EXAMPLE,
    type SkillStack,
    type SkillStackItem,
    type SkillCategory,
    type SkillProficiency,
} from './schemas/skillStack.js';

export {
    MetaSchema,
    META_EXAMPLE,
    type Meta,
} from './schemas/meta.js';

export {
    SitemapSchema,
    SITEMAP_SECTIONS,
    SITEMAP_EXAMPLE,
    type Sitemap,
    type SitemapSection,
} from './schemas/sitemap.js';

export {
    TrackQuerySchema,
    TrackResponseSchema,
    VisitorRecordSchema,
    VisitorPortfolioRecordSchema,
    VisitorWriteSchema,
    VisitorPortfolioWriteSchema,
    VISITOR_DEVICE_VALUES,
    TRACK_RESPONSE_EXAMPLE,
    VISITOR_RECORD_EXAMPLE,
    VISITOR_PORTFOLIO_RECORD_EXAMPLE,
    VISITOR_WRITE_EXAMPLE,
    VISITOR_PORTFOLIO_WRITE_EXAMPLE,
    type TrackQuery,
    type TrackResponse,
    type VisitorRecord,
    type VisitorPortfolioRecord,
    type VisitorWrite,
    type VisitorPortfolioWrite,
    type VisitorDevice,
} from './schemas/visitor.js';
