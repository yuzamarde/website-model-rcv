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

## [4.0.0] — 2026-05-31 — **BREAKING** — Portfolio LIST shape split + pagination

### Breaking

- `/api/public/user/site/:apiKey/portfolio` LIST endpoint now returns a **slim 12-field item shape** (`PortfolioListItemSchema`), down from the previous 24-field full shape.
  - Fields KEPT on LIST: `_id`, `title`, `client`, `description`, `image`, `category`, `skillsStack`, `order`, `status`, `verified`, `video`, `videoThumbnail`.
  - Fields DROPPED from LIST: `url`, `pdf`, `pdfId`, `imageId`, `videoId`, `content[]`, `role`, `startDate`, `endDate`, `sourceUrl`, `visibility`, `createdAt`, `updatedAt`.
  - Detail endpoint `/portfolio/:id` UNCHANGED — still returns full 24-field `PortfolioItemSchema`. Templates needing dropped fields fetch detail on click.
- `PortfolioListEnvelopeSchema` refactored: `usedCategories` moved from top-level into `meta`, and `meta` extended with pagination fields `{ total, limit, offset, hasMore }`.

### Added

- `PortfolioListItemSchema` — slim 12-field item for LIST endpoint.
- `PortfolioListSchema` — `z.array(PortfolioListItemSchema)`.
- `PortfolioListMetaSchema` — pagination meta `{ usedCategories, total, limit, offset, hasMore }`.
- `PORTFOLIO_LIST_EXAMPLE` and `PORTFOLIO_LIST_ENVELOPE_EXAMPLE` constants for fixture seeding.
- LIST endpoint now supports `?limit=N&offset=N` query parameters (limit: 10-50, default 12; offset: ≥0, default 0).

### Rationale

User-driven server-load reduction: dropping `content[]` eliminates the nested `content[].media` `$lookup` aggregation stage (the heaviest cost in Phase 14f), reduces wire payload ~80%, and cuts cold-cache latency ~70%. Pre-production status (0 paying buyers) justifies the BREAKING bump. See `PLAN/swirling-baking-penguin.md` Phase 15.

### Consumer migration

- **porto-be**: `formatPortfolios` repointed to new `formatPortfolioListItem`; `getUserPortfolio` controller drops `pdf` + `content.media` populate; tightens `.select()`; adds Zod pagination params.
- **porto-rs**: `repos/portfolio.rs::list_published_for_user` switched to `$facet` aggregation (items + total + categories in single round-trip); `format_portfolio_list_item` handler emits 12-field shape; `Query<PortfolioListParams>` extracts limit + offset.
- **4 RCV templates**: pin bump from `v3.0.0` → `v4.0.0`. cyandark + stanlay + rcv-origin must remove list-card `url`/`pdf` rendering (or fetch `/portfolio/:id` on click); flefy unchanged. All 4 templates wire Load More button + offset state.

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
