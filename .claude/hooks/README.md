# Hooks

Advisory guards (PostToolUse, exit 0). Wired in `.claude/settings.local.json`. They fire when
you work **directly inside this repo** (`cd` into website-model-rcv). When editing from
porto-be (the normal edit origin), the sibling `porto-be/.claude/hooks/website-model-rcv-guard.js`
covers the same discipline.

| Hook | Event | Trigger | Action |
|---|---|---|---|
| `additive-only-guard.js` | PostToolUse | `Write`/`Edit` `src/schemas/*.ts` | Remind: additive-only response shapes (no remove/rename/retype) + pre-publish gate. Warning only. |

## Writing new hooks

- Read JSON from stdin: `{ tool_name, tool_input: { file_path, ... } }`.
- Exit 0 fast if the tool/file doesn't match scope.
- Emit warnings to stdout; never `process.exit(1)` (all hooks here are advisory).
- Wrap the handler in try/catch — silent fail beats crashing the harness.
