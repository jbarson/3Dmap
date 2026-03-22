🧹 [code health improvement description]

🎯 **What:** The JSDoc block for the `computeLabelMarginTop` function included a parameter `@param fontSize` that does not exist in the actual function signature. The parameter was removed from the comment.
💡 **Why:** Removing the unused `@param fontSize` comment prevents confusion and keeps the documentation accurate.
✅ **Verification:** I ran `npm ci`, `npm run lint:fix`, `npm run lint:ci`, and `npm run test` to ensure code health and that the application is not broken by the changes.
✨ **Result:** The codebase is cleaner and the documentation is now accurate.
