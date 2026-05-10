/**
 * Smoke test: every *_EXAMPLE must round-trip through its Zod schema.
 *
 * Run after build:
 *   node dist/__smoke__/examples.js
 *
 * Or directly with `node --experimental-strip-types src/__smoke__/examples.ts`
 * (Node 22.6+).
 */
import {
    BasicInfoSchema, BASIC_INFO_EXAMPLE,
    EducationSchema, EDUCATION_EXAMPLE,
    CertificationSchema, CERTIFICATION_EXAMPLE,
    ExperienceSchema, EXPERIENCE_EXAMPLE,
    SocialAccountSchema, SOCIAL_ACCOUNT_EXAMPLE,
    LanguageSchema, LANGUAGE_EXAMPLE,
    PortfolioSchema, PORTFOLIO_EXAMPLE,
    SkillStackSchema, SKILL_STACK_EXAMPLE,
    MetaSchema, META_EXAMPLE,
    SitemapSchema, SITEMAP_EXAMPLE,
    TrackResponseSchema, TRACK_RESPONSE_EXAMPLE,
    VisitorRecordSchema, VISITOR_RECORD_EXAMPLE,
    VisitorPortfolioRecordSchema, VISITOR_PORTFOLIO_RECORD_EXAMPLE,
} from '../index.js';
import type { ZodTypeAny } from 'zod';

const cases: Array<[string, ZodTypeAny, unknown]> = [
    ['basicInfo', BasicInfoSchema, BASIC_INFO_EXAMPLE],
    ['education', EducationSchema, EDUCATION_EXAMPLE],
    ['certification', CertificationSchema, CERTIFICATION_EXAMPLE],
    ['experience', ExperienceSchema, EXPERIENCE_EXAMPLE],
    ['socialAccount', SocialAccountSchema, SOCIAL_ACCOUNT_EXAMPLE],
    ['language', LanguageSchema, LANGUAGE_EXAMPLE],
    ['portfolio', PortfolioSchema, PORTFOLIO_EXAMPLE],
    ['skillStack', SkillStackSchema, SKILL_STACK_EXAMPLE],
    ['meta', MetaSchema, META_EXAMPLE],
    ['sitemap', SitemapSchema, SITEMAP_EXAMPLE],
    ['visitor/trackResponse', TrackResponseSchema, TRACK_RESPONSE_EXAMPLE],
    ['visitor/record', VisitorRecordSchema, VISITOR_RECORD_EXAMPLE],
    ['visitor/portfolioRecord', VisitorPortfolioRecordSchema, VISITOR_PORTFOLIO_RECORD_EXAMPLE],
];

let failed = 0;
for (const [name, schema, example] of cases) {
    const result = schema.safeParse(example);
    if (result.success) {
        console.log(`ok    ${name}`);
    } else {
        failed++;
        console.error(`FAIL  ${name}`);
        console.error(result.error.format());
    }
}

if (failed > 0) {
    console.error(`\n${failed} schema(s) failed.`);
    process.exit(1);
}
console.log(`\nAll ${cases.length} schemas validated their EXAMPLE.`);
