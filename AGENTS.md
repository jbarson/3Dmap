# 3Dmap — Agent Coding Guidelines

This file provides guidelines and commands for agents working on this codebase.

## Project Overview

- **Type**: Interactive 3D web application (Three.js)
- **Tech Stack**: TypeScript, Vite, Vitest, ESLint, Prettier
- **Main Entry**: `index.html`, plus standalone viewers (`cinematic_globe.html`, `highres_globe.html`)

## Commands

### Development

```bash
npm run dev          # Start Vite dev server
npm run build        # Production build to dist/
```

### Linting & Formatting

```bash
npm run lint         # Run ESLint (shows warnings)
npm run lint:ci      # Run ESLint (must exit 0, zero warnings allowed)
npm run lint:fix     # Auto-fix ESLint errors
npm run format       # Format with Prettier
```

**Before committing**: Run `npm run lint:fix` then `npm run lint:ci` - must pass with zero warnings.

### Testing

```bash
npm test             # Run all tests once
npm run test:watch  # Run tests in watch mode

# Run a single test file
npx vitest run scripts/app.test.ts
npx vitest run scripts/utils/math.test.ts

# Run a single test by name
npx vitest run -t "sanity check"
```

## Code Style Guidelines

### TypeScript

- Use explicit types for function parameters and return types
- Prefer interfaces over types for object shapes
- Use `type` for unions, primitives, and aliases

```typescript
// Good
interface PlanetData {
  name: string;
  orbitalDistanceAU: number;
  surfaceTempK: number;
}

function getPlanetByName(name: string): PlanetData | undefined { ... }

// Avoid
const getPlanet = (n) => { ... }  // No types
```

### Naming Conventions

- **Files**: kebab-case (`mapState.ts`, `jumpLinks.ts`)
- **Classes/Interfaces**: PascalCase (`MapStateImpl`, `PlanetData`)
- **Functions/Variables**: camelCase (`getPlanetByName`, `currentSystem`)
- **Constants**: UPPER_SNAKE_CASE for config values (`MAX_ZOOM`, `DEFAULT_CENTER`)

### Imports

- Use absolute imports from project root (Vite handles resolution)
- Group imports: external → internal → types
- Sort alphabetically within groups

```typescript
// External
import { expect, test, describe, vi } from "vitest";
import * as THREE from "three";

// Internal
import { systemsArr } from "./systemsList";
import { jumpList } from "./jumpLinks";

// Types
import type { MapState, SystemData } from "./types";
```

### Formatting (Prettier)

- 2-space indentation
- Single quotes for strings
- Trailing commas
- Semicolons always

Run `npm run format` before committing.

### Error Handling

- Use try/catch for async operations
- Provide meaningful error messages
- Never expose internal errors to users

```typescript
// Good
try {
  const data = await fetchPlanetData(id);
  if (!data) {
    throw new Error(`Planet not found: ${id}`);
  }
  return data;
} catch (error) {
  console.error("Failed to load planet:", error);
  return null;
}

// Avoid
try { ... } catch (e) { return e; }  // Swallowing errors
```

### HTML/Viewers

- Standalone HTML files (`*.html`) in project root are self-contained Three.js apps
- Use ES modules with import maps for Three.js
- Follow existing patterns in `cinematic_globe.html` for new features

### Git Workflow

- Create feature branches from `main` or appropriate base
- Run lint/test before committing
- Commit messages: imperative mood ("Add feature" not "Added feature")
- Push changes and create PR for review

### Testing (Vitest)

- Place tests next to source files: `utils/math.ts` → `utils/math.test.ts`
- Use `describe()` for grouping related tests
- Use `test()` for individual test cases
- Prefer `expect()` assertions over if conditions
- Mock external dependencies

```typescript
import { expect, test, describe, vi } from "vitest";

describe("math utilities", () => {
  test("adds two numbers", () => {
    expect(add(2, 3)).toBe(5);
  });
});
```

### Three.js Specific

- Dispose of geometries and materials when removing objects from scene
- Use `requestAnimationFrame` for render loops
- Handle window resize events
- Use `Raycaster` for mouse interaction

### Asset Management

- Textures go in `public/pngs/`
- Data files go in `public/data/`
- Reference assets via absolute paths from public (`/pngs/image.png`)

## Existing CLAUDE.md Rules

This project has a CLAUDE.md file with additional guidelines. Key rule:

> Run ESLint and fix all errors before committing any branch:
>
> ```bash
> npm run lint:fix   # auto-fix what can be fixed
> npm run lint:ci    # must exit 0 (zero warnings allowed)
> ```
>
> Do not commit if `lint:ci` reports any errors or warnings.

## File Structure

```
3Dmap/
├── public/
│   ├── pngs/          # Planet textures
│   └── data/          # JSON data files
├── scripts/           # TypeScript source
│   ├── app.ts
│   ├── mapState.ts
│   ├── systemsList.ts
│   ├── types.ts
│   └── utils/
├── *.html             # Standalone viewers
├── vite.config.js
├── eslint.config.mjs
└── package.json
```
