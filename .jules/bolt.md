## 2024-05-24 - On-Demand Rendering in Three.js

**Learning:** Calling `requestAnimationFrame` continuously in Three.js combined with unconditional `renderer.render()` execution runs expensive WebGL and CSS2D render passes 60+ times per second, even when the scene is static. The `OrbitControls.update()` method actually returns a boolean indicating if the camera transformed, which is perfect for detecting movement.
**Action:** Decouple the animation loop from the render execution. Always call `requestAnimationFrame` to handle damping/momentum calculations, but only call `render()` if `controls.update()` returns true, if there is an active animation (like zooming), or if a UI interaction explicitly requests a render pass. This significantly reduces CPU and GPU usage on idle.
