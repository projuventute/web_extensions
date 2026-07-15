# RaiseNow Lifecycle Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove duplicate and timing-sensitive RaiseNow startup work on both donation pages.

**Architecture:** Keep page inclusion unchanged. The loader owns direct Tamaro core availability and emits a readiness event. Configuration waits once for that event, registers event handlers before rendering, and logs failures. Styles append a dedicated node rather than rewriting the document head.

**Tech Stack:** Browser JavaScript, Node.js built-in test runner, RaiseNow Tamaro Core.

---

### Task 1: Loader and Style Regression Tests

**Files:**
- Modify: `raisenow/widget_core.test.js`
- Modify: `raisenow/widget_core.js`
- Modify: `raisenow/widget_style.js`

- [ ] **Step 1: Write failing source assertions**

```js
assert.match(core, /window\.rnw\?\.tamaroCore/);
assert.match(core, /raisenow-core-ready/);
assert.doesNotMatch(style, /document\.head\.innerHTML/);
assert.match(style, /document\.head\.append/);
```

- [ ] **Step 2: Verify test fails**

Run: `node --test raisenow/widget_core.test.js`

Expected: failure because loader always injects core and style rewrites `document.head.innerHTML`.

- [ ] **Step 3: Implement direct-core reuse and safe style insertion**

```js
if (window.rnw?.tamaroCore) {
  window.dispatchEvent(new CustomEvent("raisenow-core-ready"));
} else {
  // Reuse existing core script or append direct Tamaro core once.
}
```

```js
var widgetStyle = document.createElement("style");
widgetStyle.id = "spendenwidget";
widgetStyle.textContent = widgetStyleInnerText;
document.head.append(widgetStyle);
```

- [ ] **Step 4: Verify test passes**

Run: `node --test raisenow/widget_core.test.js`

Expected: all tests pass.

### Task 2: Event-Driven Configuration Startup

**Files:**
- Modify: `raisenow/widget_core.test.js`
- Modify: `raisenow/widget_config.js`

- [ ] **Step 1: Write failing source assertions**

```js
assert.doesNotMatch(config, /setInterval/);
assert.match(config, /raisenow-core-ready/);
assert.match(config, /createWidget\([\s\S]*renderWidget/);
assert.match(config, /\.catch\(/);
```

- [ ] **Step 2: Verify test fails**

Run: `node --test raisenow/widget_core.test.js`

Expected: failure because configuration polls and does not handle rejected widget work.

- [ ] **Step 3: Implement one-time readiness initialization**

```js
function initializeRnwWidget() {
  if (widgetInitialized || !window.rnw?.tamaroCore || !document.getElementById("spendenwidget")) return;
  widgetInitialized = true;
  // create widget, subscribe handlers, render, and catch failures
}

window.addEventListener("raisenow-core-ready", initializeRnwWidget, { once: true });
initializeRnwWidget();
```

- [ ] **Step 4: Initialize fundraising automation safely**

```js
event.data.api.paymentForm.data.raisenow_parameters ||= {};
event.data.api.paymentForm.data.raisenow_parameters.fundraising_automation = attachment;
```

- [ ] **Step 5: Verify tests and JavaScript parsing**

Run: `node --test raisenow/widget_core.test.js; node --check raisenow/widget_config.js; node --check raisenow/widget_core.js; node --check raisenow/widget_style.js`

Expected: all commands exit with code 0.
