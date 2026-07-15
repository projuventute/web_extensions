# RaiseNow Lifecycle Design

**Goal:** Load Tamaro once, initialize it after readiness, and report failures without breaking either donation page.

**Loader:** `widget_core.js` keeps its current page inclusion. It reuses an existing `window.rnw.tamaroCore` or core script element. Otherwise it injects the direct Tamaro core URL and dispatches `raisenow-core-ready` on successful load.

**Configuration:** `widget_config.js` initializes once when the injected style and core are available. It registers all event handlers before rendering. Creation and rendering failures log one contextual console error.

**Style:** `widget_style.js` creates a single `style#spendenwidget` element and appends it to `document.head`, leaving other head nodes untouched.

**Safety:** Event handlers initialize missing `raisenow_parameters` before adding fundraising automation data.

**Testing:** Node tests inspect the deployable scripts for direct-core loading, one-time initialization, event-before-render order, failure handling, and safe style injection.
