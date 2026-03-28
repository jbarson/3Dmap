# GEMINI.md — Engineering Standards & Quality Guidelines

This document defines the foundational mandates and technical standards for the 3Dmap project. All engineering tasks must strictly adhere to these principles to ensure safety, maintainability, and excellence.

## 1. Safety & Integrity Mandates

### **1.1 Security First**

- **Credentials**: NEVER log, print, or commit secrets, API keys, or sensitive credentials.
- **XSS Prevention**: Always use `escapeHtml` or DOM text-content properties when rendering user-controlled strings (e.g., system names). NEVER use `.innerHTML` with unvalidated input.
- **Source Control**: Do not stage or commit changes unless specifically requested. Always verify `git status` before completion.

### **1.2 Context Efficiency**

- Minimize unnecessary turns and context usage.
- Prefer targeted, surgical reads of files (e.g., specifying line ranges) and parallel tool calls.
- Use sub-agents for repetitive batch tasks or high-volume output.

## 2. Engineering Excellence

### **2.1 Architectural Direction**

- **Single Source of Truth**: Consolidate logic into clean abstractions. Avoid threading state across unrelated layers.
- **Three.js Best Practices**:
  - **Resource Management**: Explicitly dispose of geometries, materials, and textures when objects are removed from the scene.
  - **Render Loop Optimization**: Skip redundant renders (e.g., labels) when the camera is idle.
  - **Frustum Culling**: Always implement frustum culling for overlay elements like CSS2D labels to reduce DOM pressure.

### **2.2 TypeScript & Type Safety**

- **Strict Typing**: Use explicit types for function parameters and return types. Avoid `any` at all costs.
- **Interfaces vs. Types**: Prefer `interface` for object shapes and `type` for unions/aliases.
- **Enums**: Use the project's existing `JumpType` and other shared types in `scripts/types.ts`.

### **2.3 Coding Style**

- **Conventions**: kebab-case for new files (existing mixed/camelCase filenames in `scripts/` are legacy), PascalCase for classes/interfaces, camelCase for functions/variables.
- **Imports**: Group and sort imports (External → Internal → Types). Use relative imports consistent with the existing project structure (for example, `./utils/...`).
- **Naming**: Be descriptive and semantic. Avoid cryptic abbreviations.

## 3. Validation & Testing

### **3.1 The Path to Finality**

- **Behavioral Correctness**: Validation is not just running tests; it is the process of ensuring every aspect of a change is correct.
- **Automated Tests**: Every feature or bug fix MUST include corresponding Vitest unit tests.
- **Regression Testing**: Always update related tests after code changes to prevent regressions.

### **3.2 Quality Gate (Pre-Commit)**

Before completing any task, you MUST run:

1. `npm run format`: Ensure consistent style.
2. `npm run lint:fix`: Auto-fix linting errors.
3. `npm run lint:ci`: Verify zero warnings/errors.
4. `npm test`: Confirm all tests pass.

## 4. Documentation & Research

### **4.1 Research -> Strategy -> Execution**

- Always research existing patterns before implementing.
- For complex architectural changes, start by writing a brief design note (for example, updating PLAN.md) before implementation.
- Reproduce bugs with test cases before applying fixes.

### **4.2 Inline Documentation**

- Provide concise, high-signal JSDoc comments for complex logic.
- Keep comments up-to-date with code changes.

---

_This document takes precedence over general workflows. Consistently applying these standards is mandatory for all contributors._
