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

See individual files in the [`schemas/`](./schemas/) folder:

| File | Endpoint(s) |
|------|-------------|
| [`schemas/basicInfo.js`](./schemas/basicInfo.js) | `/basic`, `/:username` |
| [`schemas/education.js`](./schemas/education.js) | `/education` |
| [`schemas/certification.js`](./schemas/certification.js) | `/certification` |
| [`schemas/experience.js`](./schemas/experience.js) | `/experience` |
| [`schemas/socialAccount.js`](./schemas/socialAccount.js) | `/social` |
| [`schemas/language.js`](./schemas/language.js) | `/languages` |
| [`schemas/portfolio.js`](./schemas/portfolio.js) | `/portfolio`, `/portfolio/:id` |
| [`schemas/skillStack.js`](./schemas/skillStack.js) | `/skills` |
| [`schemas/meta.js`](./schemas/meta.js) | `/meta` |
| [`schemas/sitemap.js`](./schemas/sitemap.js) | `/sitemap` |

---

## Quick Import

```js
import {
    BASIC_INFO_SHAPE,
    EDUCATION_SHAPE,
    CERTIFICATION_SHAPE,
    EXPERIENCE_SHAPE,
    SOCIAL_ACCOUNT_SHAPE,
    LANGUAGE_SHAPE,
    PORTFOLIO_SHAPE,
    SKILL_STACK_SHAPE,
    META_SHAPE,
    SITEMAP_SHAPE,
} from 'website-model-rcv';
```

---

## Notes

- `userId` is a **UUID v4** string (e.g., `"a1b2c3d4-..."`)
- `portfolioId` is a **MongoDB ObjectId** string (24 hex chars)
- All date fields are **ISO 8601** strings (`"2024-01-15T00:00:00.000Z"`) or `null`
- Fields marked `nullable` may be `null` if not set by the user
- `status` is **auto-expiring**: "Open to work" and "Open for opportunities" revert to "Unavailable" after 30 days without update
- **Privacy mask** is applied: sensitive fields (email, phone, address) may be hidden if the user disabled `sharePersonalInfo`
