<!--
website-model-rcv is the public SSOT for response shapes consumed by:
  • porto-be   (editor — pushes shapes via the src/website-model-rcv submodule)
  • porto-fe   (reader — submodule)
  • porto-rs   (reader — submodule; parity tests pin to this commit)
  • RCV-website-service ×4 templates (reader — pin via npm git URL "github:...#vX.Y.Z")

The 4 templates are deployed as static Cloudflare Pages bundles for paying
buyers. A removed/renamed/retyped field crashes their already-shipped sites.
This template forces every PR through the additive-only contract.
-->

## Summary

<!-- One sentence: what shape changed, in which schema, why. -->

## Change classification (pick one)

- [ ] **PATCH** — wording fixes, README, examples; no shape change
- [ ] **MINOR** — new endpoint shape, new optional field, new enum value, new `*_EXAMPLE`
- [ ] **MAJOR** — removed/renamed/retyped field, removed enum value (⚠ requires coordinated template rollout — see "Breaking change" section below)

## Additive-only checklist (MINOR/PATCH only)

- [ ] No field has been **removed** from any existing schema
- [ ] No field has been **renamed** (renames = remove + add → MAJOR)
- [ ] No field's **type has changed** (string → array, number → string, etc.)
- [ ] No **enum value** has been removed or renamed (adding a value is fine)
- [ ] No **shape constant** has been deleted (`BASIC_INFO_SHAPE`, `*_EXAMPLE`, etc.)
- [ ] No subpath in `package.json` `exports` map has been removed or renamed
- [ ] No named export in `src/index.ts` has been removed or renamed
- [ ] `npm test` passes locally (smoke + exports)
- [ ] `npm run build` produces a `dist/` that exports all expected subpaths

## Affected consumers

<!-- Tick every consumer whose code needs to adapt to this change. -->

- [ ] porto-be — formatter changes paired in the same submodule pointer bump
- [ ] porto-rs — parity test fixtures will need regen (additive only)
- [ ] RCV-website-service templates (×4) — repin `package.json` to the new tag, opt-in per template
- [ ] None (PATCH; no consumer changes needed)

## Breaking change (MAJOR only)

<!-- Required if MAJOR is ticked. Otherwise delete this whole block. -->

- [ ] The change is unavoidable (cannot be modeled additively or via a new endpoint version)
- [ ] A coordinated rollout plan exists (link to the PR/RFC tracking it)
- [ ] All 4 templates have a follow-up PR ready to consume the new shape
- [ ] Manager-redeploy plan is in place (canary + batched ≤ 10/min)

## Tag plan

- Current version: `vX.Y.Z`
- Proposed new tag: `vX.Y.Z+1`
- This PR's merge SHA will become the tagged commit; the tag will be force-protected (no force-push).

## Notes for reviewer

<!-- Anything special to verify. Examples, edge cases, why this PATCH isn't actually MINOR, etc. -->
