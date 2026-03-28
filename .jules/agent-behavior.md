## 2026-03-26 - Proactive PR Review Management

**Learning:** Reviewer feedback (from users or Copilot) is part of the implementation lifecycle. Leaving PR comments unaddressed leads to stalled development and increased merge friction. Jules should treat PR comments as direct instructions for the current task.

**Action:** Before marking a task as complete, always check for open PR comments using `gh pr view --comments`. If changes are requested, Jules must proactively check out the existing branch, apply the fixes, run the Quality Gate (`npm run format`, `npm run lint:ci`, `npm test`), and push the updates to the same branch to resolve the feedback loop.
