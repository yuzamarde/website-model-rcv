# Response Shapes — Additive-Only Rules

This repo is the **source-of-truth contract** for every `/api/public/user/*` response. Four
frozen-bundle template repos (RFC 0010) + porto-rs build against a pinned tag of this package
and hard-code every field name + enum value they consume. Removing or renaming any of those
crashes deployed buyer sites until each is manually redeployed — a customer-visible outage
measured in hours, not minutes.

porto-rs has a sibling runtime rule (`porto-rs/.claude/rules/additive-only.md`); this is the
contract half of the same promise.

## The rule

A schema in `src/schemas/*.ts` may:

- ADD a new **optional** field (`z.…().optional()` / `.nullable()`).
- ADD a new schema / endpoint contract.
- ADD a new enum value (append to the `*_VALUES` array).

You may NOT:

- REMOVE a field from a schema.
- RENAME a field key.
- CHANGE a field's type (string → array, number → string, …).
- Make an existing optional field **required** (breaks producers that omit it).
- REMOVE an enum value.
- CHANGE the envelope (`{ message, data }` — `src/envelope.ts` is frozen).

## Why

A buyer's CF Pages bundle built at time T hard-codes `data.basicInfo.email`. Rename `email`
→ `contactEmail` and that bundle reads `undefined` forever — until a human redeploys it. Same
for porto-rs: its `vendor/` pin + golden fixtures assume the shape as it was.

## What to do instead

| You want to… | Do this |
|---|---|
| Rename a field for clarity | Don't. Add the new name; keep the old key forever (alias derived from the new one). |
| Remove a deprecated field | Don't. Keep emitting it (`null`/stub). Document the deprecation in `porto-be/src/contracts/docs/<DATE>/`. |
| Change a field's type | Don't. Add a new field with the new type + a new name. Consumers opt in by pinning a new tag. |
| Truly need to break | Major-version bump + a NEW endpoint version + per-template repin + manager redeploy of every buyer. Sprint-sized, not a task. |

## Versioning

- Additive change (new optional field / schema / enum value) → **minor** bump (`package.json` `version`).
- Never publish a breaking change as a minor/patch. A major bump implies the coordinated
  consumer migration above.

## Edit origin (do NOT edit from a consumer)

Edited only from `porto-be` (`porto-be/src/website-model-rcv/`). `porto-fe`, `porto-rs`, and
the templates only pull/pin a published tag. Editing the schema from a consumer bypasses the
porto-be formatter + change-docs and silently diverges from what the API actually returns.

## Pre-publish gate (mandatory before tagging)

Run `porto-be/docs/contracts/WEBSITE_MODEL_RCV_PUBLISH_GATES.md` — three groups, all green:

1. **website-model-rcv smoke** — every `*_EXAMPLE` parses its `*Schema` (`npm test`).
2. **porto-be boundary suite** — `*-shape.test.js` parity vs golden fixtures (`npm run test:contracts`).
3. **porto-rs parity** — `cargo test --test parity` byte-equal vs `fixtures/responses/*`.

Adding a field = add it to BOTH the schema here AND every golden fixture (porto-be
`__fixtures__` + porto-rs `fixtures`) in the same change, then bump consumers.

## Anti-patterns

- "Just remove the field, nobody uses it" → 4 templates × N buyers may.
- "Bump v2 by changing v1 in place" → v1 is forever once a buyer is on it.
- Marking an existing optional field required → breaks producers that omit it.
- Editing `src/schemas/*` from porto-fe / porto-rs / a template instead of porto-be.
