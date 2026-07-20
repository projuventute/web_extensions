# RaiseNow Instructions

## Required Checks

Run after any JavaScript change:

```powershell
node --test raisenow/widget_core.test.js
node --check raisenow/widget_style.js
node --check raisenow/widget_core.js
node --check raisenow/widget_config.js
```

## Constraints

- Preserve script order: style, core, config.
- Preserve legacy `window.rnw.tamaro` loader and polling startup unless a replacement passes live Edge and Chrome tests.
- Keep `style#spendenwidget` idempotent. Do not rewrite `document.head.innerHTML`.
- Keep `raisenow_parameters` initialized before assigning nested tracking data.
- Treat campaign IDs, purposes, amounts, translations, and tracking field names as production configuration. Change only with a confirmed requirement.

## Release And CDN

- Update version comment in `widget_config.js` for each release.
- Use a `vX.Y.Z` Git tag for immutable production URLs.
- If a site uses jsDelivr `@latest`, push `main`, purge changed URLs at [jsDelivr Purge Cache](https://www.jsdelivr.com/tools/purge), then verify received source in browser DevTools.
