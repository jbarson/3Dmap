# 3Dmap — 3D Star Map

Interactive 3D starmap built with Three.js, Vite, and TypeScript. Explore nearby systems, visualize jump links, and toggle link types.

## Prerequisites

- Node.js 20.x (CI runs on Node 20)
- npm 10+ (bundled with Node 20)
- macOS, Linux, or Windows

Confirm your versions:

```bash
node -v
npm -v
```

## Quick start

```bash
# Clone (repo name is 3Dmap)
git clone https://github.com/jbarson/3Dmap.git
cd 3Dmap

# Install deps
npm ci

# Run dev server (Vite defaults to http://localhost:5173)
npm run dev
```

Then open http://localhost:5173 in your browser.

## Usage

- Rotate: click + drag (TrackballControls)
- Zoom: mouse wheel / trackpad pinch
- Pan: right click + drag
- Checkboxes: toggle link-type visibility (Alpha/Beta/Gamma/Delta/Epsilon)
- Date slider: scrub to mark future links as “undiscovered”

Data sources:
- Systems: `scripts/systemsList.ts`
- Jumps: `scripts/jumpLinks.ts`

## Scripts

```bash
npm run dev       # start Vite dev server
npm run build     # production build
npm test          # run vitest (watch by default)
npm run lint      # eslint (warnings allowed)
npm run lint:ci   # eslint with max-warnings=0 (CI)
npm run lint:fix  # fix autofixable issues
npm run format    # prettier write
```

## Dependencies

- Runtime: [three], [vite]
- Language/Types: [typescript]
- Tests: [vitest], [jsdom]
- Lint/Format: [eslint], [@eslint/js], [typescript-eslint], [prettier]

Key files:
- `vite.config.js` — Vite (and Vitest) config
- `tsconfig.json` — TypeScript compiler options (includes `scripts/`)
- `eslint.config.mjs` — Flat ESLint config (JS + TS + Prettier)

## Configuration

- Dev server: Vite defaults to port 5173. You can pass a port, e.g.:
	```bash
	npm run dev -- --port 5174
	```
- No environment variables are required by default.

## Testing

Vitest runs in a jsdom environment (see `vite.config.js`).

```bash
npm test          # watch mode
npm test -- --run # single run (CI-style)
```

## Contributing

- Branch naming: `feat/<issue>-short-title`, `chore/...`, `fix/...`, `docs/...`
- Commits: concise, imperative (e.g., `feat: add star label helper`)
- Lint/format before pushing: `npm run lint && npm run format`
- Pull Requests: use the template and include a closing keyword, e.g.:
	- `Fixed issue #<number>` (auto-closes on merge)

## CI

GitHub Actions workflow at `.github/workflows/ci.yml` runs on push/PR:
- Install dependencies: `npm ci`
- Lint: `npm run lint:ci`
- Tests: `npm test -- --run`
- Build: `npm run build`

## License

ISC. See `package.json`.

<!-- references -->
[three]: https://threejs.org/
[vite]: https://vitejs.dev/
[typescript]: https://www.typescriptlang.org/
[vitest]: https://vitest.dev/
[jsdom]: https://github.com/jsdom/jsdom
[eslint]: https://eslint.org/
[\@eslint/js]: https://github.com/eslint/js
[typescript-eslint]: https://typescript-eslint.io/
[prettier]: https://prettier.io/