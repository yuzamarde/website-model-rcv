# CLAUDE.md — website-model-rcv

Source-of-truth **response-shape contracts** (TypeScript + Zod) for the Porto public
portfolio-website API (`/api/public/user/*`). Consumed by `porto-be` (parity tests),
`porto-rs` (Rust read-side, via `vendor/`), and the 4 RCV templates (npm pin).

## The one rule

**Public response shapes are ADDITIVE-ONLY.** A deployed buyer's Cloudflare Pages bundle
hard-codes every response key it reads. Removing, renaming, or retyping a field crashes
live buyer sites until each is manually redeployed. **Read `.claude/rules/additive-only.md`
before touching anything in `src/schemas/`.**

## Edit origin

This repo is edited **only from `porto-be`** (mounted at `porto-be/src/website-model-rcv/`).
`porto-fe` / `porto-rs` / templates are read-only consumers — they pull/pin a published tag,
never edit the content. See the monorepo root `CLAUDE.md` → "Contract change workflow".

## Layout

- `src/schemas/<domain>.ts` — one Zod schema + inferred type + `*_EXAMPLE` per endpoint.
- `src/envelope.ts` — the `{ message, data }` wrapper (`apiEnvelope`). Frozen.
- `dist/` — compiled artifact (the only thing published to npm; see `package.json` `files`).

## Commands

```bash
npm run build   # tsc → dist/
npm test        # smoke (every *_EXAMPLE parses its Schema) + export check
```

## Before tagging a new version

Run the full pre-publish gate (`porto-be/docs/contracts/WEBSITE_MODEL_RCV_PUBLISH_GATES.md`):
website-model-rcv smoke + porto-be boundary suite + porto-rs parity — ALL green. Then bump
the `porto-rs` `vendor/` pointer + the 4 template npm pins. Never skip — a silent break fans
out across 4 templates × N buyers.

## .claude/ map

```
.claude/
├── rules/additive-only.md        # the response-shape evolution rule
├── hooks/additive-only-guard.js  # advisory reminder on src/schemas edits
└── settings.local.json           # hook wiring
```

Hooks run automatically after tool calls (advisory, exit 0).
