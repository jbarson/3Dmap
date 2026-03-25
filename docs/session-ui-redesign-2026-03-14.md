# Session Notes: UI Redesign & Planet-Detail Integration

_2026-03-14_

## Changes Made

### Menu panel redesign (`css/style.css`, `index.html`)

- Imported **Rajdhani** (UI font) and **Share Tech Mono** (data/numbers) from Google Fonts via `<link>` in `index.html`
- CSS variables defined on `:root` for the full colour palette (`--accent`, `--panel-bg`, etc.) — edit these to retheme the panel
- Panel structure changed from a flat `.title`/`.dateSpan` div to semantic `<section class="control-section">` blocks with `.section-header` dividers
- Custom checkboxes use `appearance: none` + `::after` pseudo-element for the checkmark
- Menu **defaults to open**: JS now calls `controlsPanel.classList.add("open")` on DOMContentLoaded instead of hiding it

### Planet-detail page (`cinematic_globe.html` → `planet-detail.html`)

- File renamed; `vite.config.js` entry updated from `cinematic` → `planetDetail`
- All references updated: `index.html` nav link, `app.ts` href, page `<title>`, `#info` bar text

### Bidirectional navigation

- **Star map → planet-detail**: `showSystemDetail()` in `app.ts` checks `GLOBE_PLANETS` set; if the system has a matching planet, renders a `.globe-link` anchor to `/planet-detail.html?planet=<key>`
- **Planet-detail → star map**: `#starmap-link` element (top-right, fixed) has its `href` updated to `/#focus=<sysName>` inside `switchPlanet()` each time the planet changes
- The star map uses **hash-based URL params** (`/#focus=SystemName`) parsed with `new URLSearchParams(location.hash.slice(1))`

### Name mismatch: Novoya Rossiya/Nova Brazil ↔ Novaya

- The star map uses the full name `"Novoya Rossiya/Nova Brazil"` in `systemsList.ts`
- The planet-detail page uses `name: 'Novaya'` as the URL key (keeps existing `?planet=Novaya` URLs working)
- A `displayName: 'Novoya Rossiya/Nova Brazil'` field was added to that planet entry; the selector list, `#info` bar, and HUD all render `displayName || name`
- `GLOBE_PLANET_KEY` in `app.ts` maps the star map name to the URL key: `{ "Novoya Rossiya/Nova Brazil": "Novaya" }`
- The selector active-state check was updated to use `link.dataset.name` (the URL key) rather than `link.textContent` (which now differs)

### Star sprite sizes (`scripts/utils/scene.ts`)

- Sizes live in the `STAR_SIZE` record, keyed by first letter of spectral class
- Reduced across the board: A 400→200, F 320→160, G 180→120, K 150→100, M 90→70, D 60→50
- `DEFAULT_STAR_SIZE` reduced from 100 → 80

### Label legibility (`css/style.css`)

- Added `background: rgba(0,0,0,0.55)` + `padding: 0 3px` + `border-radius: 2px` to `.starLabel` and `.planetLabel` — gives a dark pill behind each label
- Strengthened `text-shadow` to two layers of solid black
- Added `font-weight: 600` to both label classes

### System detail panel position

- Moved from `bottom: 20px; left: 50%; transform: translateX(-50%)` to `top: 60px; right: 12px`
- Fixed width `260px` (replaces `min-width`/`max-width`)

## Bugs Fixed

| Bug                                                           | File             | Fix                                                                                                       |
| ------------------------------------------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------- |
| `#systemDetailContent li` missing closing `}` before `@media` | `css/style.css`  | Added closing brace                                                                                       |
| `__dirname` not defined in ESM `vite.config.js`               | `vite.config.js` | Replaced `resolve(__dirname, x)` with `resolve(x)` (uses `cwd()` which is always project root under Vite) |
| Reference to deleted `highres_globe.html` in build entries    | `vite.config.js` | Removed the entry                                                                                         |

## Architecture Notes

- `sysName` on each planet in `planet-detail.html` is the authoritative link back to the star map — keep this in sync if system names ever change in `systemsList.ts`
- `GLOBE_PLANETS` in `app.ts` must be updated whenever a new planet is added to `planet-detail.html`
- The planet-detail page is a standalone HTML file (no Vite/TS module graph) — it uses an importmap for Three.js from jsDelivr CDN
- Star label font size and margin-top are computed per-frame in `mapState.ts` `render()` — CSS `font-size` on `.starLabel` is a baseline that gets overridden by inline style
