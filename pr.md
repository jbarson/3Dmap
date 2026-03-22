🧪 Add missing tests for MapStateImpl

🎯 **What:** The `MapStateImpl` class in `scripts/mapState.ts` lacked tests because it requires significant mocking of THREE.js classes and DOM elements. This PR introduces a new test file `scripts/mapState.test.ts` that provides the necessary mocks and comprehensive tests. It also removes a duplicate `onZoom` declaration in `scripts/mapState.ts`.
📊 **Coverage:** The tests now cover:
- `MapStateImpl` instantiation and property initialization via `init()`.
- Link visibility toggling (`toggleAlpha`, `toggleBeta`, `toggleGamma`, `toggleDelta`, `toggleEpsi`).
- `focusOnSystem` query logic (finding systems, handling invalid inputs).
- `zoomToStar` camera animation configuration and `onZoom` callback triggering.
✨ **Result:** Test coverage for `MapStateImpl` is significantly improved, adding 12 new passing test cases and ensuring future modifications to the 3D map state logic can be made with confidence.
