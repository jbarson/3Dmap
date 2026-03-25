## 2024-05-24 - Cache Three.js SpriteMaterials

**Learning:** For optimal Three.js performance, materials (like `SpriteMaterial`) and textures should be cached and reused across instances instead of creating them per-object. Instantiating a new material for every star sprite severely limits batching and wastes memory.
**Action:** Always maintain a cache (e.g., `Map`) for shared materials and textures. Centralize disposal in a cache clearing method (e.g., `clearSceneCache()`) to prevent memory leaks or double-disposal during scene cleanup.
