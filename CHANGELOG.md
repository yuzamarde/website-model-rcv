# Changelog

All notable changes to `website-model-rcv` are documented here.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This package follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html) with one extra rule:
**every release is additive-only** unless explicitly marked MAJOR. See `.github/pull_request_template.md`
for the contract.

## Consumers (why this matters)

- `porto-be` — editor, pushes shape changes via the `porto-be/src/website-model-rcv/` submodule.
- `porto-fe` — reader, submodule.
- `porto-rs` — reader, submodule; parity tests pin to a tagged commit.
- `RCV-website-service` ×4 templates — reader via npm git URL `"github:yuzamarde/website-model-rcv#vX.Y.Z"` (exact tag). Deployed as static Cloudflare Pages bundles for paying buyers. **A removed/renamed/retyped field crashes their shipped sites.**

## Versioning rules

| Bump  | What may change                                              | Consumer action                |
| ----- | ------------------------------------------------------------ | ------------------------------ |
| PATCH | Wording fixes, README, examples (no shape change)            | None — safe to stay on old pin |
| MINOR | New endpoint shape, new optional field, new enum value       | Opt-in: repin to new tag       |
| MAJOR | Removed / renamed / retyped field (avoid; coordinate rollout) | Migration per template         |

## Unreleased

_Nothing yet._

## [2.4.0] — 2026-05-10

First formally-tagged release. All previously published 2.x evolution is collapsed under this entry; the next release will track changes incrementally.

### Added (relative to `2.3.x` working state in git)
- Visitor tracking schemas: `TrackQuerySchema`, `TrackResponseSchema`, `VisitorRecordSchema`, `VisitorPortfolioRecordSchema`, `VISITOR_DEVICE_VALUES`, `TRACK_RESPONSE_EXAMPLE`, `VISITOR_RECORD_EXAMPLE`, `VISITOR_PORTFOLIO_RECORD_EXAMPLE`.
- `./schemas/visitor` subpath in `package.json` `exports` map (the file existed and was re-exported from root since 2.4.0, but the subpath was missing — added in this release-prep PR so `import x from 'website-model-rcv/schemas/visitor'` resolves).
- `npm run test:exports` script + `src/__smoke__/exports.ts` — fails fast on any accidental removal of an `exports` subpath or a named export from the root index. Wired into `npm test` and `prepublishOnly`.

### Process
- Added `.github/pull_request_template.md` enforcing additive-only classification on every PR.
- Established the additive-only contract documented above.
- This is the **baseline tag** that all four RCV-website-service templates and porto-rs initially pin to.

### Endpoint surfaces in v2.4.0 (frozen list)

The following Zod schemas + `*_EXAMPLE` fixtures + named-type exports are present. Consumers can rely on this list as the minimum surface for the v2.x line.

- `apiEnvelope` (root response envelope)
- `BasicInfoSchema`, `BASIC_INFO_EXAMPLE`, `USER_STATUS`, `USER_ROLES`
- `EducationSchema`, `EducationItemSchema`, `EDUCATION_DEGREES`, `EDUCATION_EXAMPLE`
- `CertificationSchema`, `CertificationItemSchema`, `CERTIFICATION_EXAMPLE`
- `ExperienceSchema`, `ExperienceItemSchema`, `PositionSchema`, `EXPERIENCE_CONTRACT_TYPES`, `EXPERIENCE_TYPE_WORK`, `EXPERIENCE_EXAMPLE`
- `SocialAccountSchema`, `SocialAccountItemSchema`, `SocialPlatformSchema`, `SOCIAL_ACCOUNT_EXAMPLE`
- `LanguageSchema`, `LanguageItemSchema`, `LANGUAGE_PROFICIENCY_LEVELS`, `LANGUAGE_CODES`, `LANGUAGE_MAP`, `LANGUAGE_NATIVE_MAP`, `LANGUAGE_EXAMPLE`
- `PortfolioSchema`, `PortfolioItemSchema`, `PortfolioCategorySchema`, `PortfolioImageBlockSchema`, `PortfolioDescriptionBlockSchema`, `PortfolioContentBlockSchema`, `PortfolioListEnvelopeSchema`, `PORTFOLIO_STATUS_VALUES`, `PORTFOLIO_VISIBILITY_VALUES`, `PORTFOLIO_BLOCK_TYPES`, `PORTFOLIO_EXAMPLE`
- `SkillStackSchema`, `SkillStackItemSchema`, `SkillCategorySchema`, `SKILL_PROFICIENCY_VALUES`, `SKILL_STACK_EXAMPLE`
- `MetaSchema`, `META_EXAMPLE`
- `SitemapSchema`, `SITEMAP_SECTIONS`, `SITEMAP_EXAMPLE`
- `TrackQuerySchema`, `TrackResponseSchema`, `VisitorRecordSchema`, `VisitorPortfolioRecordSchema`, `VISITOR_DEVICE_VALUES`, `TRACK_RESPONSE_EXAMPLE`, `VISITOR_RECORD_EXAMPLE`, `VISITOR_PORTFOLIO_RECORD_EXAMPLE`

## [2.0.0] – [2.3.x] — pre-2026-05-10

Pre-formalization history. Recovered from git only; no per-version notes. Refer to commit log:

- `91093df` — feat: update version to 2.4.0 and enhance visitor tracking schemas
- `9a2d2ed` — feat: add Zod schemas and examples for user portfolio API
- `d9c0fa6` — feat: initial source-of-truth contracts for Porto website user API

[2.4.0]: https://github.com/yuzamarde/website-model-rcv/releases/tag/v2.4.0
