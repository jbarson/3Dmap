# Session Report: 3Dmap Enhancements (March 12, 2026)

## 1. Asset Pipeline & Generation

We identified that existing `_bump.png`, `_specular.png`, and `_night.png` files were solid black placeholders. A new automation script was created to derive these layers from base color textures.

- **Script:** `scripts/generate_maps.sh`
- **Dependencies:** ImageMagick (`magick`)
- **Output:**
  - `_bump.png`: Grayscale heightmap with boosted contrast.
  - `_specular.png`: Inverted high-contrast map (Oceans shiny, Land matte).
  - `_night.png`: Crushed-black gamma-corrected map for city lights.
- **Usage:** `bash scripts/generate_maps.sh`

## 2. Cinematic Globe Viewer (`cinematic_globe.html`)

The cinematic globe was upgraded with advanced GLSL shaders to provide a high-fidelity visual experience.

### Shader Architecture:

- **Seamless Surface:** Enabled `RepeatWrapping` on all planet textures to eliminate the vertical seam at 0/360 longitude.
- **3D Procedural Clouds:**
  - Switched from 2D UV sampling to **3D Local-Space Normal sampling** (`vLocalNormal`).
  - Implemented **Domain Warping** (Warped FBM) to create swirly, filamentous, and turbulent atmospheric patterns.
  - **Anisotropy:** Coordinates are stretched along the x-axis (`1.5x`) to simulate planetary rotation/wind drag.
- **Per-Planet Signatures:**
  - `uCloudSeed`: Randomizes the base noise pattern for each planet.
  - `uCloudScale`: Adjusts the atmospheric scale (large storms vs. small wisps).
- **Dynamic Lighting:** Clouds are programmatically lit using the sun direction (`uSunDir`) and masked on the night side.

### Controls:

- Added a **Cloud Coverage Slider** (0% - 100%) that updates the `uCloudCoverage` uniform in real-time, affecting both the visible cloud layer and the surface shadows.

## 3. Deployment & Git Notes

- **Large File Handling:** Earth textures (`Earth.jpg`, `Earth_bump.png`, etc.) exceed 100MB and were excluded from the repository to prevent Git push failures.
- **Initial Planet:** The default view was shifted from Earth to **Altiplano** to ensure a functional experience out-of-the-box without oversized assets.

## 4. High-Performance Data Strategies

- **1M Record Generation:** Use Python `set()` for uniqueness and `executemany` (batch inserts) or `COPY` (Postgres) for 100x speedup over single inserts.
- **Sub-Minute Distribution:** Use **Redis** (`LPOP`) for user claims or **S3/Cloudfront** for bulk downloads to bypass SQL locking and network bottlenecks.
