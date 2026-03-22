## 2024-03-22 - [XSS via unescaped innerHTML in app detail and HUD]

**Vulnerability:** Unescaped strings derived from user input/data files were passed directly to `innerHTML` when displaying system/planet details in `scripts/app.ts` and HUD data in `planet-detail.html`.
**Learning:** Developers often construct complex HTML using template literals and insert it via `innerHTML` without explicitly considering the potential for XSS if the interpolated variables are not properly escaped. This issue existed in both TypeScript and HTML files in the repo.
**Prevention:** Implement an `escapeHtml` utility and systematically escape variables (such as entity names, identifiers, and formatted properties) before inclusion into HTML strings meant for `innerHTML`.
