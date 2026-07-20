# web_extensions

Browser JavaScript snippets used by Pro Juventute websites. Each top-level folder is an independent integration.

## Folders

- `raisenow/`: donation-widget loader, configuration, styles, and regression tests.
- `geo-popup/`, `isBot/`, `whatsapp/`: standalone website extensions.

## Updating The Published Latest Version

The GitHub default branch is [`main`](https://github.com/projuventute/web_extensions/tree/main). jsDelivr's `@latest` URLs resolve to files from that branch.

1. Make and verify a change locally.
2. Commit it and push it to `main`.
3. Purge each affected `@latest` jsDelivr URL at [jsDelivr Purge Cache](https://www.jsdelivr.com/tools/purge).
4. Verify the browser receives the expected source in DevTools Network or Sources.

jsDelivr can otherwise cache an `@latest` URL for up to seven days. Prefer a version tag in production website embeds when the page can be updated, for example `@v2.12.2`, because a tag URL is immutable.

## Releases

Create a version commit and lightweight tag after verification:

```powershell
git commit -m "Describe change"
git tag vX.Y.Z
git push origin main --tags
```

Do not push unreviewed changes. Update website embeds to the new tag when they use pinned URLs.
