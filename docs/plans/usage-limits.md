---
sidebar_label: "Usage limits"
sidebar_position: 5
description: "Cap how many items a member can create, per plan."
---

<!-- AUTO-GENERATED from plans (docs/public/usage-limits.md). Do not edit here — run `npm run sync`. -->

# Usage limits

Plans LQ supports optional **feature add-ons** you can drop into your site with a
small snippet. The first is **usage limits** — cap how many items a member can
create based on their plan. _(More feature snippets will be added over time.)_

Set a **Quota** on each plan, then add the two snippets below.

## Backend gate

Create `backend/data.js` and replace `Listings` with your collection name:

```js
import { checkQuota } from '@liquisio/plans-api/backend';

export async function Listings_beforeInsert(item, context) {
  return checkQuota(item, context);
}
```

This resolves the member's plan from their role and throws
`LIMIT_REACHED:<limit>` to block the insert once they reach their plan's quota.

## Frontend UI

On the page that holds your dataset:

```js
import { limitItems } from '@liquisio/plans-api/public';

$w.onReady(function () {
  limitItems({
    datasetId: '#submitDataset',           // your form dataset (write-only is fine)
    showIfLimitReached: '#boxLimitReached' // revealed when a save is blocked
  });
});
```

The backend `checkQuota` hook is the source of truth: it throws
`LIMIT_REACHED:<limit>` from `beforeInsert`, which fails the dataset save and
fires the dataset's `onError`. `limitItems` listens for that and reveals the
box (hiding it again after a save that succeeds). It never counts items on the
frontend, so the dataset can be write-only — the message is reactive (shown
after a blocked submit, not on page load).

> **Free baseline:** members with no matching plan are blocked by default. To
> grant a free allowance, pass `{ defaultLimit: 1 }` to both `checkQuota` and
> `limitItems` — keep the two values in sync.
