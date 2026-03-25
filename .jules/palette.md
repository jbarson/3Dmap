## 2024-05-19 - Focus Visible on Custom Elements

**Learning:** When styling custom UI elements (like ranges and checkboxes) with `outline: none` to remove default browser rings, keyboard accessibility is completely destroyed. This app uses a lot of customized web controls.
**Action:** Always add a clear `:focus-visible` ring using the app's accent color (`--accent`) to interactive elements. Using `outline-offset` prevents the focus ring from blending into the custom borders.

## 2024-05-20 - Focus Management and Escape Key Dismissal for Custom Panels

**Learning:** Custom dynamic panels or dialogs created entirely with DOM elements (like the `systemDetail` panel) lack native focus management and dismiss behaviors, resulting in an inaccessible experience for keyboard users who cannot easily focus the panel contents or dismiss the overlay using the Escape key.
**Action:** When implementing custom panels or dialogs, always explicitly manage focus (e.g., calling `.focus()` on the close button when opened) and add a global event listener to handle dismissing the panel when the `Escape` key is pressed.
