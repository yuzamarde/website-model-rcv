/**
 * Claude Code Hook — additive-only guard  [PostToolUse]
 *
 * Reminds, on every edit under `src/schemas/`, that this public response contract is
 * additive-only (deployed buyer bundles + porto-rs parity hard-code every key). Advisory
 * only (exit 0). Fires when working DIRECTLY inside this repo; when editing from porto-be,
 * the sibling porto-be/.claude/hooks/website-model-rcv-guard.js covers the same discipline.
 */

const TARGET = /src[/\\]schemas[/\\].+\.ts$/;

const chunks = [];
process.stdin.on('data', c => chunks.push(c));
process.stdin.on('end', () => {
    try {
        const input = JSON.parse(Buffer.concat(chunks).toString());
        const toolName = input.tool_name || '';
        const filePath = input.tool_input?.file_path || '';

        if (toolName !== 'Write' && toolName !== 'Edit') { process.exit(0); }
        if (!TARGET.test(filePath)) { process.exit(0); }

        console.log('\n── website-model-rcv: ADDITIVE-ONLY ─────────────────────');
        console.log('  ⚠️  Public response contract. Deployed buyer bundles + porto-rs parity');
        console.log('      hard-code every key. ADD optional fields / schemas / enum values only —');
        console.log('      never REMOVE / RENAME / RETYPE, and never make an optional field required.');
        console.log('  Before tagging: run the pre-publish gate (smoke + porto-be shape + porto-rs');
        console.log('  parity), then bump porto-rs vendor/ + the 4 template npm pins.');
        console.log('  Rule: .claude/rules/additive-only.md');
        console.log('─────────────────────────────────────────────────────────\n');
    } catch {
        // Advisory only — never crash the harness.
    }
});
