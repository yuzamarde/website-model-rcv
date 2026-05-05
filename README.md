# website-model-rcv

> **Source-of-truth response contracts** for the Porto public portfolio website API.
>
> This repo documents the exact JSON shape returned by every `/api/public/user/*` endpoint.
> Use it as a reference when building a website template that consumes the Porto API.

---

## Base URL

```
https://<your-domain>/api/public/user
```

All endpoints are **public** (no authentication required).

---

## Endpoint Index

| Method | Endpoint | Description | Cache TTL |
|--------|----------|-------------|-----------|
| GET | `/id/:userId/basic` | User profile by userId (UUID) | 5 min |
| GET | `/:username` | User profile by username | 5 min |
| GET | `/id/:userId/education` | Education history | 5 min |
| GET | `/id/:userId/certification` | Certifications | 5 min |
| GET | `/id/:userId/experience` | Work experience | 5 min |
| GET | `/id/:userId/social` | Social media accounts | 5 min |
| GET | `/id/:userId/portfolio` | Portfolio projects | 5 min |
| GET | `/id/:userId/portfolio/:portfolioId` | Single portfolio detail | 5 min |
| GET | `/id/:userId/languages` | Language proficiencies | 5 min |
| GET | `/id/:userId/skills` | Skill stacks | 5 min |
| GET | `/id/:userId/meta` | SEO / OpenGraph meta | 1 hour |
| GET | `/id/:userId/sitemap` | Sitemap sections & IDs | 1 hour |
| GET | `/id/:userId/track` | Record a page visit (fire & forget) | no cache |

---

## Response Envelope

Every endpoint wraps its data in a standard envelope:

```json
{
  "message": "...",
  "data": { ... }
}
```

- **`message`** — human-readable status string
- **`data`** — the actual payload (object or array, see each endpoint below)

---

## Rate Limits (per 5-minute window)

| Endpoint group | Max requests |
|----------------|-------------|
| `/basic`, `/:username` | 60 |
| `/education`, `/certification`, `/experience`, `/social`, `/portfolio`, `/languages`, `/skills` | 40 |
| `/meta` | 30 |
| `/sitemap`, `/track` | 20 |

---

## Response Shapes

Each endpoint has a Zod schema + an inferred TypeScript type. Source lives in
[`src/schemas/`](./src/schemas/); the published artifact is compiled to `dist/`.

| Source file | Endpoint(s) | Exports |
|-------------|-------------|---------|
| [`src/schemas/basicInfo.ts`](./src/schemas/basicInfo.ts)         | `/basic`, `/:username`              | `BasicInfoSchema`, `BasicInfo`, `USER_STATUS`, `USER_ROLES` |
| [`src/schemas/education.ts`](./src/schemas/education.ts)         | `/education`                        | `EducationSchema`, `Education`, `EDUCATION_DEGREES` |
| [`src/schemas/certification.ts`](./src/schemas/certification.ts) | `/certification`                    | `CertificationSchema`, `Certification` |
| [`src/schemas/experience.ts`](./src/schemas/experience.ts)       | `/experience`                       | `ExperienceSchema`, `Experience`, `Position`, contract / type-work enums |
| [`src/schemas/socialAccount.ts`](./src/schemas/socialAccount.ts) | `/social`                           | `SocialAccountSchema`, `SocialPlatform` |
| [`src/schemas/language.ts`](./src/schemas/language.ts)           | `/languages`                        | `LanguageSchema`, `LANGUAGE_CODES`, `LANGUAGE_MAP` |
| [`src/schemas/portfolio.ts`](./src/schemas/portfolio.ts)         | `/portfolio`, `/portfolio/:id`      | `PortfolioSchema`, `PortfolioListEnvelopeSchema`, status / visibility enums |
| [`src/schemas/skillStack.ts`](./src/schemas/skillStack.ts)       | `/skills`                           | `SkillStackSchema`, `SKILL_PROFICIENCY_VALUES` |
| [`src/schemas/meta.ts`](./src/schemas/meta.ts)                   | `/meta`                             | `MetaSchema`, `Meta` |
| [`src/schemas/sitemap.ts`](./src/schemas/sitemap.ts)             | `/sitemap`                          | `SitemapSchema`, `SITEMAP_SECTIONS` |

---

## Quick Import

TypeScript:

```ts
import { BasicInfoSchema, type BasicInfo, apiEnvelope } from 'website-model-rcv';

const Envelope = apiEnvelope(BasicInfoSchema);
const res = await fetch(`/api/public/user/id/${userId}/basic`).then(r => r.json());
const { data: info } = Envelope.parse(res); // info: BasicInfo
```

JavaScript:

```js
import { BasicInfoSchema } from 'website-model-rcv';

const res = await fetch(`/api/public/user/id/${userId}/basic`).then(r => r.json());
const info = BasicInfoSchema.parse(res.data);
```

---

## Building (contributors)

```bash
npm install
npm run build      # tsc → dist/
npm run smoke      # validate every *_EXAMPLE against its Schema
```

> v2 breaking change: the legacy `*_SHAPE` string-typed objects (v1) have been
> replaced with Zod schemas (`*Schema`) and inferred types. The `*_EXAMPLE`
> constants and enum arrays are preserved with the same names.

---

## Notes

- `userId` is a **UUID v4** string (e.g., `"a1b2c3d4-..."`)
- `portfolioId` is a **MongoDB ObjectId** string (24 hex chars)
- All date fields are **ISO 8601** strings (`"2024-01-15T00:00:00.000Z"`) or `null`
- Fields marked `nullable` may be `null` if not set by the user
- `status` is **auto-expiring**: "Open to work" and "Open for opportunities" revert to "Unavailable" after 30 days without update
- **Privacy mask** is applied: sensitive fields (email, phone, address) may be hidden if the user disabled `sharePersonalInfo`
