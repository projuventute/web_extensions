# RaiseNow Widget

Donation widget integration for Pro Juventute pages.

## Files

- `widget_style.js`: injects `style#spendenwidget` once.
- `widget_core.js`: loads RaiseNow legacy widget bootstrap.
- `widget_config.js`: waits for the legacy widget, applies donation configuration, tracking, and campaign mapping.
- `widget_core.test.js`: Node regression tests for the loader, styles, and polling startup.

Load website scripts in this order: style, core, then config.

## Local Verification

```powershell
node --test raisenow/widget_core.test.js
node --check raisenow/widget_style.js
node --check raisenow/widget_core.js
node --check raisenow/widget_config.js
```

Test the donation page in Edge and Chrome after any loader or startup change.

## Publish A Version

1. Update version comment at top of `widget_config.js`.
2. Run local verification.
3. Commit and tag `vX.Y.Z`.
4. Push `main` and the tag to GitHub.
5. Update the website's jsDelivr URLs to the new tag when using pinned embeds.
6. Verify deployed source in browser DevTools.

The repository's [`main` branch](https://github.com/projuventute/web_extensions/tree/main) controls jsDelivr `@latest`. Pushing a commit to `main` updates its origin, but cached jsDelivr responses can remain stale.

## Purge jsDelivr Cache

Open [jsDelivr Purge Cache](https://www.jsdelivr.com/tools/purge). Paste each affected mutable URL and submit it. For this widget, typical URLs are:

```text
https://cdn.jsdelivr.net/gh/projuventute/web_extensions@latest/raisenow/widget_style.js
https://cdn.jsdelivr.net/gh/projuventute/web_extensions@latest/raisenow/widget_core.js
https://cdn.jsdelivr.net/gh/projuventute/web_extensions@latest/raisenow/widget_config.js
```

Purge applies to `@latest` or other mutable aliases. A tagged URL such as `@v2.12.2` is immutable and should not need purge. Reload the donation page and inspect each script response to confirm expected version.

## Compatibility Boundary

Current integration uses legacy `window.rnw.tamaro` and polling. Do not migrate to `tamaroCore`, `createWidget`, `renderWidget`, or `@raisenow/tamaro-core` without live Edge and Chrome verification. An earlier migration failed in Edge when the third-party core attempted a cross-origin dynamic import.
