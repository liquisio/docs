---
sidebar_label: "For developers"
sidebar_position: 7
description: "Extension points such as a custom webhook logger."
---

<!-- AUTO-GENERATED from plans (docs/public/developers.md). Do not edit here — run `npm run sync`. -->

# For developers

Plans LQ's backend ships as the `@liquisio/plans-api` package. Most sites just
re-export its handlers (see [Installation](./installation.md)), but the package
also exposes lower-level factories for teams that want to customize behavior.
This page is the home for those extension points — more will be documented here
over time.

## Custom webhook logger

`post_plansLqStripeWebhook` is a thin wrapper around `createStripeWebhookHandler`.
Call the factory yourself to inject your own logger (it defaults to `console`),
or to wrap the handler with extra logic:

```js
import { createStripeWebhookHandler } from '@liquisio/plans-api/backend';

export function post_plansLqStripeWebhook(request) {
  return createStripeWebhookHandler(request, myLogger);
}
```

The second argument is a logger object (with `info` / `warn` / `error`
methods) — pass your own to route the handler's reconcile logs into your
monitoring.
