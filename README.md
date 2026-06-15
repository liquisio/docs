# Liquisio Docs

The company documentation hub, built with [Docusaurus](https://docusaurus.io/).
Hosts guides, API references, and customer-support docs for all Liquisio
products. Deployed to GitHub Pages at **https://docs.liquis.io**.

## How content is organized

Docs are grouped **by product, then by doc type**. Each product is a folder
under `docs/`:

```
docs/
  index.md            # hub landing page (served at the site root)
  plans/              # product: Plans LQ
    _category_.json   # sidebar group + landing index for the product
    setup.md          # generated from the Plans repo
    testing.md        # generated from the Plans repo
```

Adding a product is just adding a folder — the sidebar is generated from the
directory structure (`sidebars.ts`).

## Content sync (source of truth)

Most product docs are **not authored here**. Their source of truth lives in the
product repos; `scripts/sync-docs.mjs` copies the designated public docs in,
rewrites their cross-links, and stamps Docusaurus frontmatter. Generated files
carry an `AUTO-GENERATED` banner and **are committed** to this repo, so the CI
build doesn't need access to the (often private) product repos.

Currently synced:

| Product | Source (in the product repo) | Lands at |
|---|---|---|
| Plans LQ | `package/README.md` | `/plans/setup` |
| Plans LQ | `package/TESTING.md` | `/plans/testing` |

To refresh after upstream docs change:

```bash
npm run sync
# or point at a non-sibling checkout:
PLANS_REPO=/path/to/plans npm run sync
```

`sync` also runs automatically before `npm run start` and `npm run build`. It
expects the product repo as a **sibling** of this one (`../plans`), or at the
path given by `PLANS_REPO`. If the source repo isn't found, that product is
skipped with a warning and its committed docs are left as-is — so the build
never fails just because a source checkout is missing.

**In CI it runs nightly**, too — see [Deployment](#deployment).

To add another product, add a block to `PRODUCTS` in `scripts/sync-docs.mjs`
and create a `docs/<product>/_category_.json`.

## Local development

```bash
npm install
npm run start     # runs sync, then serves at http://localhost:3000/docs/
```

```bash
npm run build     # production build into ./build
npm run serve     # preview the production build
npm run typecheck # tsc on the config/components
```

## Deployment

`.github/workflows/deploy.yml` builds the site and publishes it to GitHub Pages
(repo **Settings → Pages → Source** = **GitHub Actions**). It runs on three
triggers:

- **push to `main`** — deploy when the docs repo itself changes;
- **nightly cron (07:00 UTC)** — rebuild from the latest product-repo docs;
- **manual** (`workflow_dispatch`) — run the sync + deploy on demand from the
  Actions tab.

The site is served from the custom domain **https://docs.liquis.io**
(`static/CNAME` + `url`/`baseUrl` in `docusaurus.config.ts`).

### Auto-sync from the product repos (one-time setup)

On each build, CI checks out the (private) product repos and runs `npm run sync`
so the deployed site always reflects the latest upstream docs. For this to work,
add a secret to **this** repo:

1. Create a **fine-grained Personal Access Token** (or a GitHub App token)
   with **Contents: Read-only** on `liquisio/plans`
   (Settings → Developer settings → Fine-grained tokens).
2. In `liquisio/docs`, add it under **Settings → Secrets and variables →
   Actions** as **`PLANS_REPO_TOKEN`**.

If the token is missing or expired, the checkout is skipped (`continue-on-error`)
and CI builds the committed copies instead — the deploy never hard-fails on it.

> This is the **nightly-pull** model. To make pushes to a product repo update
> the docs immediately, add a `repository_dispatch` trigger here and a small
> "notify" workflow in the product repo (event-driven model) — the cron then
> becomes a backstop.
