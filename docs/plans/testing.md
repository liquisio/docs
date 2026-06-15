---
sidebar_label: "Testing"
sidebar_position: 5
description: "Run a full subscribe-to-role flow with a Stripe test account."
---

<!-- AUTO-GENERATED from plans (docs/public/testing.md). Do not edit here — run `npm run sync`. -->

# Testing with a Stripe test account

Spin up a throwaway **test** Stripe account, connect it to Plans LQ, and run a
full *subscribe → role granted* flow — without touching live money or entering
any real business, identity, or bank details. Everything below uses Stripe's
**magic test values**, which satisfy onboarding instantly in test mode.

> **Prerequisite:** the Plans LQ platform must be fully set up on its side so
> **Connect with Stripe** can finalize. If that button errors with *Invalid or
> expired state* or *Server not configured*, that's a platform-side gap — not
> something you can fix from here.
>
> **Just want zero setup?** Skip straight to **1-click default test** in Setup —
> it runs every test buyer through a shared platform test account, so you can
> ignore steps 2–3 entirely. The steps below are for connecting *your own* test
> account.

## 1. Switch the dashboard to Test mode

In **Plans LQ → Setup**, set the mode dropdown (top-right) to **Test** (amber).
This scopes everything you configure to test mode — **and** routes your
published site's checkout to Stripe test mode until you switch back to **Live**.
(If your site is already live and you only want to test one purchase, leave the
mode on **Live** and use a `?lqTest` link instead — see step 5.)

## 2. Connect a test account (Connect with Stripe)

1. Click **Connect with Stripe**. A new tab opens Stripe's hosted connect flow
   in test mode.
2. Choose **create a new account** (or sign into an existing test account), then
   fill the activation form using the test values in step 3.
3. Authorize. You should land on **"Account connected — close this tab."** Close
   it and return to the dashboard.
4. Click **Re-check** on the Setup checklist — the **Connect with Stripe** row
   turns green, showing your connected `acct_…` id. If it warns that charges
   aren't enabled yet, finish Stripe's activation form (step 3).

> The secret-key field is **not** a way to skip connecting — you always
> **Connect with Stripe** first, then add the account's `sk_test_…` key in the
> next step.

## 3. Stripe onboarding — magic test values

Enter these in Stripe's activation form. They pass verification instantly in
test mode. **Never enter real data in test mode.**

| Field | Value | Notes |
|---|---|---|
| Phone — SMS code | `000-000` | the OTP for any test phone number |
| Phone number | `0000000000` | passes validation |
| Individual ID (SSN) | `000000000` | full SSN; use `0000` when only the last 4 are asked |
| Date of birth | `1901-01-01` | successful match — **avoid** `1900-01-01` (OFAC alert) |
| Business tax ID (EIN) | `000000000` | use `000000001` for a non-profit |
| Address — line 1 | `address_full_match` | enables **both** charges + payouts |
| Bank routing (US) | `110000000` | — |
| Bank account (US) | `000999999991` | payouts enabled (completes after a short delay) |

Outside the US, Stripe uses region-specific test bank numbers — see the full
list in Stripe's [Connect testing](https://docs.stripe.com/connect/testing) docs.

## 4. Finish the test-mode setup

Back in **Setup** (still Test mode), complete the remaining checklist rows:

- **Add your secret key** — paste the account's `sk_test_…`. Plans LQ uses it
  only to register the webhook + reconcile roles, never for charges.
- **Grant member access on payment** → **Set up** — creates the test Stripe
  webhook + stores its signing secret.
- **Let members manage their plan** → **Set up** — sets up the Manage / Switch
  portal flows.
- **Sync plans** — only leads if you created plans *before* connecting test
  mode; it backfills their test-mode Stripe ids.

Run **Re-check** — every row should be green.

## 5. Run a test checkout

If you set the mode dropdown to **Test** in step 1, your published site already
routes every buyer to Stripe test — just subscribe with a test card below. To
instead test on a **live** site without redirecting real buyers, leave the mode
on **Live** and append `?lqTest=<token>` to your plans page URL (generate the
token in Settings; it routes only that link to test). Test cards:

| Scenario | Card number | Extra |
|---|---|---|
| Success | `4242 4242 4242 4242` | any future expiry, any CVC, any ZIP |
| Requires 3D Secure | `4000 0027 6000 3184` | complete the authentication dialog |
| Generic decline | `4000 0000 0000 0002` | — |

Mastercard `5555 5555 5555 4444` and Amex `3782 822463 10005` (4-digit CVC) also
work for a successful charge.

After checkout, click **Verify access** on the confirmation page — your member
role should appear.

## 6. Clean up

Wix has **no** test mode, so a test subscription grants the **real** member
role + contact label. When you're done, **cancel the test subscription** in the
Stripe dashboard — the webhook then strips the role and label.

---

*Card and onboarding values are from Stripe's official testing docs:*
[*Test cards*](https://docs.stripe.com/testing) · [*Connect testing*](https://docs.stripe.com/connect/testing).
