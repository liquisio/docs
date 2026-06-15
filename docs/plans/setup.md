---
sidebar_label: "Installation & Setup"
sidebar_position: 1
description: "Install and configure Plans LQ on your Wix site."
---

<!-- AUTO-GENERATED from plans (package/README.md). Do not edit here — run `npm run sync`. -->

# Plans LQ — Installation & Setup

A cheaper alternative to the Wix Pricing Plans app: sell subscriptions through
**your own Stripe account** and grant Wix member **roles + contact labels**
automatically via a single Stripe webhook.

## Step 1 — Pre-requisites

- Install the **Wix Members Area** app. _(Also required to save Stripe keys to
  the Secrets Manager.)_
- Create **contact labels** for your plans (Contacts → Labels).
- Create **site member roles** for your plans (dashboard → Roles & Permissions).
- **Publish your site** — Velo HTTP functions only run on a published site.

## Step 2 — Install

- Install the app, approve permissions.
- Install the npm package on your site: `@liquisio/plans-api`.

## Step 3 — Wire the backend (one file)

Create **`backend/http-functions.js`** and re-export the three handlers:

```js
export {
  post_plansLqStripeWebhook,    // Stripe → grants/strips roles + labels (live & test)
  post_plansLqReconcileMember,  // the "Verify access" button on the confirmation page
  get_plansLqHealth,            // health probe used by the app's setup checklist
} from '@liquisio/plans-api/backend';
```

That's the whole backend. There is **no** `backend/events.js` anymore — the old
`wixCrm_onContactUpdated` events handler and `post_claimPlan` are replaced by the
webhook above.

> Custom logger? Call the factory yourself:
> ```js
> import { createStripeWebhookHandler } from '@liquisio/plans-api/backend';
> export function post_plansLqStripeWebhook(request) {
>   return createStripeWebhookHandler(request, myLogger);
> }
> ```

## Step 4 — Settings (in the Plans LQ dashboard → Settings)

1. Paste your Stripe **live** and **test** secret keys (saved to Secrets Manager).
2. Confirm the **site URL** (auto-detected; override if needed).
3. Click **Register** for each mode — this creates the Stripe webhook and stores
   its signing secret automatically.
4. Click **Configure** for each mode — sets up the Billing Portal (incl. the
   switchable-plan list).
5. _(Optional)_ **Generate the test-mode token** to verify the flow in Stripe
   test mode by appending `?lqTest=<token>` to your plans page URL.
6. Run **Re-check** on the setup checklist — every row should be green.

## Step 5 — Create plans

- Create your plans; associate a **contact label** and **role** with each.
- Every save mirrors the plan to **both** Stripe modes (live + test).
- _(Optional)_ Set a **Quota** to cap how many items a member may create (Step 7).

## Step 6 — Plans page

- Connect your plans repeater to the `@liquisio/plans/Plans` CMS collection.
- Add the **Plan Button** widget inside each repeater item.
- Add this snippet to the page and adjust the element ids:

```js
import { initiatePlanButtons } from '@liquisio/plans-api/public';

$w.onReady(function () {
  initiatePlanButtons({
    repeaterId: '#repeater1',
    buttonId: '#plansLqPlanButton1',
    planIdField: '_id',
  });
});
```

Add the **Confirmation** widget to a `/confirmation` page and the **Manage
Subscription** widget wherever members manage their plan.

## Step 7 — Usage limits (optional)

Cap how many items a member can create based on their plan. Set a **Quota** on
each plan, then add the two snippets below.

**Backend gate** — create `backend/data.js` and replace `Listings` with your
collection name:

```js
import { checkQuota } from '@liquisio/plans-api/backend';

export async function Listings_beforeInsert(item, context) {
  return checkQuota(item, context);
}
```

This resolves the member's plan from their role and throws
`LIMIT_REACHED:<limit>` to block the insert once they reach their plan's quota.

**Frontend UI** — on the page that holds your dataset:

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

## Test-mode note

A **test** checkout still grants the **real** Wix role/label (Wix has no test
mode). After verifying, cancel the test subscription in Stripe — the webhook
then strips the role.

> **Want to test the full flow first?** [`TESTING.md`](./testing.md) is a
> quick-start for connecting a Stripe **test** account (with Stripe's magic
> test values) and running a test checkout end to end.
