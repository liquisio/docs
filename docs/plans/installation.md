---
sidebar_label: "Installation"
sidebar_position: 1
description: "Install the Plans LQ app + package and wire the backend."
---

<!-- AUTO-GENERATED from plans (docs/public/installation.md). Do not edit here — run `npm run sync`. -->

# Installation

Plans LQ is a cheaper alternative to the Wix Pricing Plans app: sell
subscriptions through **your own Stripe account** (connected via Stripe Connect)
and grant Wix member **roles + contact labels** automatically via a single
Stripe webhook.

This page covers the one-time install. After it, [connect your Stripe
account](./connect-stripe.md) and [create your plans](./plans-setup.md).

## 1. Pre-requisites

- Install the **Wix Members Area** app. _(Also required to save Stripe keys to
  the Secrets Manager.)_
- Create **contact labels** for your plans (Contacts → Labels).
- Create **site member roles** for your plans (dashboard → Roles & Permissions).
- **Publish your site** — Velo HTTP functions only run on a published site.

## 2. Install Plans LQ

- Install the app, approve permissions.
- Install the npm package on your site: `@liquisio/plans-api`.

## 3. Wire the backend (one file)

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

> Need a custom logger or other backend customization? See
> [For developers](./developers.md).

---

**Next:** [Connect your Stripe account →](./connect-stripe.md)
