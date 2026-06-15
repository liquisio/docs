---
sidebar_label: "Connect Stripe"
sidebar_position: 2
description: "Connect your Stripe account and finish Plans LQ setup."
---

<!-- AUTO-GENERATED from plans (docs/public/connect-stripe.md). Do not edit here — run `npm run sync`. -->

# Connect Stripe

Plans LQ charges through **Stripe Connect** — you connect your own Stripe
account and the app charges on it as the platform. This page sets up the
connection and the supporting Stripe config.

> Complete [Installation](./installation.md) first.

## Run the Setup checklist

Open **Plans LQ → Setup** and work the checklist top to bottom. The **mode**
dropdown (top-right) scopes every step to **Live** or **Test**, and also sets
which mode your *published site* checks out in — leave it on **Live** for a live
launch.

For each mode you want to sell in:

1. **Connect with Stripe** — opens Stripe's hosted Connect flow in a new tab.
   Authorize, then return to the dashboard.
2. **Add your secret key** — paste that account's secret key. Plans LQ uses it
   only to register the webhook + reconcile roles, **never** for charges.
3. **Grant member access on payment** → **Set up** — registers the Stripe
   webhook and stores its signing secret.
4. **Let members manage their plan** → **Set up** — creates the Billing Portal
   (Manage + Switch-plan flows).
5. Press **Re-check** — every row should turn green. The checklist also
   re-verifies the install prerequisites (site, members, labels, roles,
   package), so it doubles as your "is everything wired?" view.

> The site URL is auto-detected; override it in **Settings** if detection is
> wrong. **Connect with Stripe** is powered by the Plans LQ platform — if it
> errors with *Invalid or expired state* or *Server not configured*, that's a
> platform-side issue, so reach out to support.

## A note on test mode

A **test** checkout still grants the **real** Wix role/label (Wix has no test
mode). After verifying, cancel the test subscription in Stripe — the webhook
then strips the role.

Want to trial the whole flow before going live? The [Testing guide](./testing.md)
walks through connecting a Stripe **test** account (with Stripe's magic test
values), or the zero-setup **shared test account**, and running a test checkout
end to end.

---

**Next:** [Create & display your plans →](./plans-setup.md)
