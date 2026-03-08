# 3Dmap — Claude Code Instructions

## Before Committing

Run ESLint and fix all errors before committing any branch:

```bash
npm run lint:fix   # auto-fix what can be fixed
npm run lint:ci    # must exit 0 (zero warnings allowed)
```

Do not commit if `lint:ci` reports any errors or warnings.
