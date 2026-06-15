---
sidebar_label: "Creating plans"
sidebar_position: 3
description: "Create plans and display them with a widget or your own design."
---

<!-- AUTO-GENERATED from plans (docs/public/plans-setup.md). Do not edit here — run `npm run sync`. -->

# Creating & displaying plans

With Stripe [connected](./connect-stripe.md), create your plans and put them on
your site.

## Create plans

- Create your plans; associate a **contact label** and **role** with each.
- Each save mirrors the plan into every **connected** Stripe mode. Connected a
  mode *after* creating plans? Use **Sync plans** in Setup to backfill its
  Stripe ids.
- _(Optional)_ Set a **Quota** to cap how many items a member may create — see
  [Usage limits](./usage-limits.md).

## Put plans on your page

You have two options — pick one.

### Option A — the Plan List widget (simplest)

Drop the **Plan List** widget onto your page. It renders your active plans as
cards and sends buyers straight to checkout — no code and no dataset wiring.
This is the recommended starting point.

### Option B — your own design (repeater + Plan Button)

For full control over the layout, build the list yourself:

- Connect a repeater to the `@liquisio/plans/Plans` CMS collection.
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

## Confirmation & management widgets

Whichever option you chose, add these two widgets so buyers can confirm access
and manage their subscription:

- Add the **Confirmation** widget to a `/confirmation` page — buyers land here
  after checkout and can verify access.
- Add the **Manage Subscription** widget wherever members manage their plan.

---

**Next:** [Add usage limits →](./usage-limits.md) · [Test the full flow →](./testing.md)
