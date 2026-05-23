/**
 * Exports smoke test: asserts every subpath declared in package.json `exports`
 * resolves to a module that loads cleanly, and that every named export in the
 * root index is still present.
 *
 * Why this exists: removing or renaming a shape export silently breaks every
 * downstream consumer (porto-rs parity tests, 4 RCV-website-service templates).
 * This test fails fast on any accidental break.
 *
 * Run after build:
 *   node dist/__smoke__/exports.js
 *
 * Or directly with `node --experimental-strip-types src/__smoke__/exports.ts`
 * (Node 22.6+).
 */

const subpaths = [
    { subpath: './envelope', mustHave: ['apiEnvelope'] },
    { subpath: './schemas/basicInfo', mustHave: ['BasicInfoSchema', 'BASIC_INFO_EXAMPLE', 'USER_STATUS', 'USER_ROLES'] },
    { subpath: './schemas/profile', mustHave: ['ProfileSchema', 'PROFILE_EXAMPLE'] },
    { subpath: './schemas/education', mustHave: ['EducationSchema', 'EducationItemSchema', 'EDUCATION_DEGREES', 'EDUCATION_EXAMPLE'] },
    { subpath: './schemas/certification', mustHave: ['CertificationSchema', 'CertificationItemSchema', 'CERTIFICATION_EXAMPLE'] },
    { subpath: './schemas/experience', mustHave: ['ExperienceSchema', 'ExperienceItemSchema', 'PositionSchema', 'EXPERIENCE_CONTRACT_TYPES', 'EXPERIENCE_TYPE_WORK', 'EXPERIENCE_EXAMPLE'] },
    { subpath: './schemas/socialAccount', mustHave: ['SocialAccountSchema', 'SocialAccountItemSchema', 'SocialPlatformSchema', 'SOCIAL_ACCOUNT_EXAMPLE'] },
    { subpath: './schemas/language', mustHave: ['LanguageSchema', 'LanguageItemSchema', 'LANGUAGE_PROFICIENCY_LEVELS', 'LANGUAGE_CODES', 'LANGUAGE_MAP', 'LANGUAGE_NATIVE_MAP', 'LANGUAGE_EXAMPLE'] },
    { subpath: './schemas/portfolio', mustHave: ['PortfolioSchema', 'PortfolioItemSchema', 'PortfolioCategorySchema', 'PortfolioImageBlockSchema', 'PortfolioDescriptionBlockSchema', 'PortfolioContentBlockSchema', 'PortfolioListEnvelopeSchema', 'PORTFOLIO_STATUS_VALUES', 'PORTFOLIO_VISIBILITY_VALUES', 'PORTFOLIO_BLOCK_TYPES', 'PORTFOLIO_EXAMPLE'] },
    { subpath: './schemas/skillStack', mustHave: ['SkillStackSchema', 'SkillStackItemSchema', 'SkillCategorySchema', 'SKILL_PROFICIENCY_VALUES', 'SKILL_STACK_EXAMPLE'] },
    { subpath: './schemas/meta', mustHave: ['MetaSchema', 'META_EXAMPLE'] },
    { subpath: './schemas/sitemap', mustHave: ['SitemapSchema', 'SITEMAP_SECTIONS', 'SITEMAP_EXAMPLE'] },
    { subpath: './schemas/visitor', mustHave: ['TrackQuerySchema', 'TrackResponseSchema', 'VisitorRecordSchema', 'VisitorPortfolioRecordSchema', 'VisitorWriteSchema', 'VisitorPortfolioWriteSchema', 'VISITOR_DEVICE_VALUES', 'TRACK_RESPONSE_EXAMPLE', 'VISITOR_RECORD_EXAMPLE', 'VISITOR_PORTFOLIO_RECORD_EXAMPLE', 'VISITOR_WRITE_EXAMPLE', 'VISITOR_PORTFOLIO_WRITE_EXAMPLE'] },
];

const rootMustHave = [
    'apiEnvelope',
    'BasicInfoSchema', 'BASIC_INFO_EXAMPLE', 'USER_STATUS', 'USER_ROLES',
    'ProfileSchema', 'PROFILE_EXAMPLE',
    'EducationSchema', 'EducationItemSchema', 'EDUCATION_DEGREES', 'EDUCATION_EXAMPLE',
    'CertificationSchema', 'CertificationItemSchema', 'CERTIFICATION_EXAMPLE',
    'ExperienceSchema', 'ExperienceItemSchema', 'PositionSchema', 'EXPERIENCE_CONTRACT_TYPES', 'EXPERIENCE_TYPE_WORK', 'EXPERIENCE_EXAMPLE',
    'SocialAccountSchema', 'SocialAccountItemSchema', 'SocialPlatformSchema', 'SOCIAL_ACCOUNT_EXAMPLE',
    'LanguageSchema', 'LanguageItemSchema', 'LANGUAGE_PROFICIENCY_LEVELS', 'LANGUAGE_CODES', 'LANGUAGE_MAP', 'LANGUAGE_NATIVE_MAP', 'LANGUAGE_EXAMPLE',
    'PortfolioSchema', 'PortfolioItemSchema', 'PortfolioCategorySchema', 'PortfolioImageBlockSchema', 'PortfolioDescriptionBlockSchema', 'PortfolioContentBlockSchema', 'PortfolioListEnvelopeSchema', 'PORTFOLIO_STATUS_VALUES', 'PORTFOLIO_VISIBILITY_VALUES', 'PORTFOLIO_BLOCK_TYPES', 'PORTFOLIO_EXAMPLE',
    'SkillStackSchema', 'SkillStackItemSchema', 'SkillCategorySchema', 'SKILL_PROFICIENCY_VALUES', 'SKILL_STACK_EXAMPLE',
    'MetaSchema', 'META_EXAMPLE',
    'SitemapSchema', 'SITEMAP_SECTIONS', 'SITEMAP_EXAMPLE',
    'TrackQuerySchema', 'TrackResponseSchema', 'VisitorRecordSchema', 'VisitorPortfolioRecordSchema', 'VisitorWriteSchema', 'VisitorPortfolioWriteSchema', 'VISITOR_DEVICE_VALUES', 'TRACK_RESPONSE_EXAMPLE', 'VISITOR_RECORD_EXAMPLE', 'VISITOR_PORTFOLIO_RECORD_EXAMPLE', 'VISITOR_WRITE_EXAMPLE', 'VISITOR_PORTFOLIO_WRITE_EXAMPLE',
];

const subpathToRelativeSourcePath = (subpath: string): string => {
    if (subpath === '.') return '../index.js';
    return `..${subpath.slice(1)}.js`;
};

let failed = 0;

for (const { subpath, mustHave } of subpaths) {
    const relative = subpathToRelativeSourcePath(subpath);
    try {
        const mod = await import(relative);
        const missing = mustHave.filter((name) => !(name in mod));
        if (missing.length === 0) {
            console.log(`ok    ${subpath} (${mustHave.length} exports)`);
        } else {
            failed++;
            console.error(`FAIL  ${subpath} missing exports: ${missing.join(', ')}`);
        }
    } catch (err) {
        failed++;
        console.error(`FAIL  ${subpath} failed to load: ${(err as Error).message}`);
    }
}

try {
    const root = await import('../index.js');
    const missing = rootMustHave.filter((name) => !(name in root));
    if (missing.length === 0) {
        console.log(`ok    .            (${rootMustHave.length} exports)`);
    } else {
        failed++;
        console.error(`FAIL  .            missing exports: ${missing.join(', ')}`);
    }
} catch (err) {
    failed++;
    console.error(`FAIL  .            failed to load: ${(err as Error).message}`);
}

if (failed > 0) {
    console.error(`\n${failed} export check(s) failed.`);
    process.exit(1);
}
console.log(`\nAll ${subpaths.length + 1} export surfaces resolved.`);
