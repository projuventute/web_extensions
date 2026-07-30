---
name: raisenow-purpose-setup
title: RaiseNow Purpose Setup
summary: Set up a donation purpose in raisenow/widget_config.js for a fundraising campaign requested via Jira.
description: Use ONLY when setting up a new donation purpose in raisenow/widget_config.js for a fundraising campaign requested by a Jira issue (SD-NNNNN on projuventute.atlassian.net). Reads the "Spendenwidget Tamaro" Confluence page, recommends the oldest replaceable purpose (never p1-p5, p8, p20), and plans URL-based default purpose + amounts, onetime amounts, per-payment-method Salesforce campaign IDs, and a version bump. Asks for user confirmation twice (purpose choice, then plan) before applying edits.
tools:
  - atlassian_getJiraIssue
  - atlassian_getConfluencePage
  - question
  - edit
  - read
  - bash
prompt: Set up the donation purpose for SD-23224.
language: en
status: Published
author: Martin Seifert
---

# RaiseNow Purpose Setup

## When to use

User supplies a Jira issue (URL or key like `SD-23224`) asking for a new donation purpose + campaign mapping for a fundraising campaign, and the task is to wire it up in `raisenow/widget_config.js`.

Do NOT use for: translation changes, bug fixes, refactoring, or external partner widgets (Corris / Lazoona).

## Constants

- cloudId (projuventute.atlassian.net): `6c8aab74-408c-49ed-a941-4ab3118201ff`
- Confluence page ID: `3010330677` (title "Spendenwidget Tamaro", anchor `#Aktuell-verwandte-Purposes-und-Kampagnen`)

## Workflow

### 1. Read the Jira issue

Call `atlassian_getJiraIssue` with the issue key (e.g. `SD-23224`). From the description, extract:

- **Landing page URLs** in DE / FR / IT. Derive the URL slug from the path segment.
- **Default amounts**: a list of 3 numbers (e.g. `[45, 95, 150]`).
- **Salesforce campaign IDs**, grouped by payment method (the page "Spendenwidget Tamaro" documents these groups; the Jira issue typically lists them as "ESR", "TWINT/KK", "RD TWINT/KK", "Paypal"):
  - DD + QR-Rechnung (`chqr`, `dd`, `qr-bill`, `ch_qr_reference`) — usually labelled ESR
  - Twint + Karten + Postfinance (`twint`, `twi`, `card`, `vis`, `eca`, `pfc`) — may split `onetime` vs `recurring`
  - Paypal (`paypal`, `pp`) — may split `onetime` vs `recurring`; sometimes omitted (then falls back to default campaign)
- **Issue key** (for the version comment).

If anything is missing or ambiguous, ask the user via `question` before proceeding.

### 2. Read the Confluence page

Call `atlassian_getConfluencePage` with `pageId=3010330677`, `contentFormat=markdown`. Parse the table under the section "Aktuell verwandte Purposes und Kampagnen".

Columns: Purpose, Beschreibung, Einmalige oder Recurring, Kampagnen (DD+QR / Twint+Karten / Paypal), Zugeordnet am, Jira. Each purpose spans two rows (einmalig, recurring); the `Zugeordnet am` date is identical on both rows and is the sort key.

Build a list `{ purpose, assignedAt, description, jira }[]`.

### 3. Pick a replaceable purpose

Fixed purposes — never reuse:
`p1`, `p2`, `p3`, `p4`, `p5`, `p8`, `p20`.

From the remainder, recommend the one with the **oldest `assignedAt`**. Show the user the top 3 candidates (oldest first) with their date and short description, then ask for confirmation via the `question` tool. Do not proceed without it.

If a campaign explicitly referenced a particular purpose (e.g. the Jira issue links to "SD-XXXXX" in the Jira column for an existing purpose), surface that match too.

Once the purpose is confirmed, tell the user that the Confluence table must be updated manually (human in the loop — the model must not edit the Confluence page). Send them the direct link to the table so they can update the row for the reused purpose with the new `Zugeordnet am` date and the Jira key:

<https://projuventute.atlassian.net/wiki/spaces/SFCRM/pages/3010330677/Spendenwidget+Tamaro#Aktuell-verwandte-Purposes-und-Kampagnen>

### 4. Plan the four edits

For each of the four edits, output the **exact code snippet** that would be added or changed. Do not describe only in prose.

1. **Version comment** at the top of `widget_config.js`. Bump the second digit and reset the third to `0`. Update date to today and use the Jira key. Format:
   ```
   // vX.Y.Z - YYYY-MM-DD - SD-NNNNN: <short description>
   ```
   Example: `// v2.12.2 - 2026-07-20 - SD-23040: safe style and tracking guards` → `// v2.13.0 - 2026-07-30 - SD-23224: Ferienfonds August-Mailing`.

2. **URL-based default purpose + amounts** — in the `var currentPurpose = "p1"` block. Add a new `else if (window.location.href.match(...))` branch covering all three languages:
   ```js
   } else if (window.location.href.match(/.*\/de\/<slug>.*|.*\/fr\/<slug-fr>.*|.*\/it\/<slug-it>.*/)) {
     currentPurpose = "pXX";
     currentAmounts = [a, b, c];
   ```
   Insert it into the existing `else if` chain before the trailing blank branch. Preserve the 2-space indentation used by the file.

3. **Default amounts for the purpose** — in the `amounts` array passed to `rnw.tamaro.runWidget`. Add a new entry **before** the catch-all `{ if: "paymentType() == onetime", then: currentAmounts }`:
   ```js
   {
     if: "paymentType() == onetime && purpose() == pXX",
     then: [a, b, c],
   },
   ```
   The amount triple should match the per-purpose default from step 2.

4. **Campaign lookup per payment method** — in the `paymentMethodChanged` subscriber. For each of the three payment-method groups, add a `case "pXX":` (with a nested `switch (event.data.api.paymentForm.data.payment_type)` when recurring differs from onetime):
   - `case "paypal":` and `case "pp":` (Paypal)
   - `case "chqr": case "dd": case "qr-bill": case "ch_qr_reference":` (DD + QR-Rechnung)
   - `case "twint": case "twi": case "card": case "vis": case "eca": case "pfc": default:` (Twint + Karten + Postfinance)

   Insert each new `case "pXX":` in numeric order with the other cases, before any trailing `default:`. Keep the trailing `// note: RaiseNow allows max. 20 different purposes` comment.

If the Jira issue does not supply a campaign ID for a payment-method group, do **not** add a `case` for it — flag the omission to the user and let them decide whether the implicit default is acceptable.

### 5. Confirm again, then apply

Show all four snippets as one consolidated block. Ask for confirmation via `question`. Only then call `edit` on `raisenow/widget_config.js` to apply each change. Surgical edits only — do not refactor neighbouring code.

### 6. Validate

```powershell
node --test raisenow/widget_core.test.js
node --check raisenow/widget_style.js
node --check raisenow/widget_core.js
node --check raisenow/widget_config.js
```

All must pass. If any fails, fix and re-run before reporting back.

## Constraints (from `raisenow/AGENTS.md`)

- Campaign IDs, purposes, amounts, translations, and tracking field names are production configuration. Change only with a confirmed requirement.
- Do not commit, push, or tag. User releases manually.

## After validation, suggest (do not act)

- Commit message and `vX.Y.Z` git tag for jsDelivr
- Push `main` and the tag, purge jsDelivr cache for any `@latest` embeds
- Update the Confluence table row for the reused purpose: new "Zugeordnet am" date and the new Jira key if not already done
