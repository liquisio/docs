# Liquisio Docs

The company documentation hub, built with [Docusaurus](https://docusaurus.io/).
Hosts guides, API references, and customer-support docs for all Liquisio
products. Deployed to GitHub Pages at **https://liquisio.github.io/docs/**.

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
expects the product repo as a **sibling** of this one (`../plans`). If the
source repo isn't found, that product is skipped with a warning and its
committed docs are left as-is — so the build never fails just because a source
checkout is missing.

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

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds the site
and publishes it to GitHub Pages. The repo's **Settings → Pages → Source** is
set to **GitHub Actions**.

To use a custom domain (e.g. `docs.liquisio.com`) later: point the domain at
Pages, add a `static/CNAME` file, and set `url`/`baseUrl` accordingly in
`docusaurus.config.ts` (with a custom domain, `baseUrl` becomes `/`).
