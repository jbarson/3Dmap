## 2024-05-19 - Focus Visible on Custom Elements

**Learning:** When styling custom UI elements (like ranges and checkboxes) with `outline: none` to remove default browser rings, keyboard accessibility is completely destroyed. This app uses a lot of customized web controls.
**Action:** Always add a clear `:focus-visible` ring using the app's accent color (`--accent`) to interactive elements. Using `outline-offset` prevents the focus ring from blending into the custom borders.
