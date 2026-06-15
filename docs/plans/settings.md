---
sidebar_label: "Settings"
sidebar_position: 4
description: "Behavior options: checkout, Billing Portal, tax, promo codes, and the test-mode token."
---

<!-- AUTO-GENERATED from plans (docs/public/settings.md). Do not edit here — run `npm run sync`. -->

# Settings

**Plans LQ → Settings** holds behavior **options** — it doesn't connect Stripe
or create plans (that's [Connect Stripe](./connect-stripe.md) and [Creating
plans](./plans-setup.md)). There are two areas: **General** (applies to both
modes) and **Checkout & portal options** (configured per mode). Click **Save
{Mode} settings** to persist the current mode's options.

## The mode dropdown (top-right)

The dropdown in the page header is the **single mode control** — Live, Test, or
Default test. Switching it sets **both**:

- what you configure (here *and* in Setup), and
- the mode **every buyer** checks out in on your published site.

So **Live** means your site is taking real payments; **Test** / **Default test**
means buyers aren't charged — but a test purchase still grants the real Wix
role, so cancel it afterward. (To preview test mode on a *live* site without
switching everyone, use the **test-mode token** below instead.)

## General (applies to both modes)

- **Detected site URL** — your published site URL, auto-detected. Webhook and
  health-check URLs are derived from it.
- **Site URL override** — set this only if detection is wrong. It's saved when
  you click **Save**. Because webhook URLs derive from the site URL, **re-run
  the webhook step in Setup** after changing it.
- **Test-mode token** — generate a token, then append `?lqTest=<token>` to a
  plans page URL to route **just that link's** checkout to Stripe test mode
  while your published site stays Live. A test purchase still grants the real
  Wix role — cancel the test subscription afterward to strip it. Use
  **Regenerate** to rotate the token (which invalidates the old one).

## Checkout & portal options (per mode)

These are configured **independently per mode**. **Default test** runs on the
app's shared test account, so they're **read-only** there — switch to **Live**
or your own **Test** account to change them.

### Checkout

Applies to new checkouts in this mode **after you Save**.

- **Automatic tax (Stripe Tax)** — collect tax via Stripe Tax. Requires a
  registered jurisdiction in **Stripe → Tax** for this mode.
- **Allow promotion codes** — let buyers enter a promo code at checkout.
- **Adaptive Pricing (buyer-local currency)** — show prices in the buyer's
  currency. Also enable it in **Stripe → Settings → Multi-currency
  presentment**.
- **Require Terms of Service at checkout** — buyers must accept your ToS.
  Configure the checkout ToS URL in **Stripe → Settings → Branding**; the
  **Terms of Service URL** field here is the link used by the Billing Portal.
- **Default tax behavior** — **Exclusive** (tax added on top) or **Inclusive**
  (tax included). A per-plan setting can override this.

### Billing Portal

Applies **after you re-run Configure** on *"Let members manage their plan"* in
[Setup](./connect-stripe.md).

- **Allow plan switching** — let members switch plans from the portal.
- **Prorate on switch** — prorate charges when a member switches mid-cycle.
- **Cancellation timing** — **At period end** or **Immediately**.

> **When changes take effect:** checkout options (tax / promo / ToS / tax
> behavior) apply to new checkouts after **Save**; portal options apply after
> you click **Set up / Update** on the portal step in **Setup**.
