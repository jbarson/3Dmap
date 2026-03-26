## 2024-05-19 - Focus Visible on Custom Elements

**Learning:** When styling custom UI elements (like ranges and checkboxes) with `outline: none` to remove default browser rings, keyboard accessibility is completely destroyed. This app uses a lot of customized web controls.
**Action:** Always add a clear `:focus-visible` ring using the app's accent color (`--accent`) to interactive elements. Using `outline-offset` prevents the focus ring from blending into the custom borders.

## 2026-03-24 - Custom Dialog Focus Management and Link States

**Learning:** When displaying dynamic custom panels (like the system detail overlay), managing focus by explicitly targeting the close button ensures keyboard and screen reader users aren't disoriented. Furthermore, using aria-current="page" on custom link lists is necessary since CSS .active classes are strictly visual.
**Action:** Always send focus to a logical element (like a close button or header) when revealing custom panels, handle Escape keys to close them, and use aria-current along with visual active states.

## 2026-03-26 - Icon-only Tooltips and Dynamic ARIA Labels

**Learning:** While `aria-label` provides screen reader support for icon-only buttons, sighted users navigating with a mouse or keyboard may not understand the button's function without a native tooltip (`title`). Furthermore, when a link's destination or context changes dynamically (e.g., "Back to Star Map" becoming "Back to Delta Pavonis in Star Map"), its `aria-label` must also be updated programmatically to prevent stale accessibility information.
**Action:** Always provide both `aria-label` and `title` attributes on icon-only interactive elements. When dynamically updating a link or button's `title` via JavaScript, ensure the corresponding `aria-label` is also updated to keep sighted and screen-reader experiences synchronized.
