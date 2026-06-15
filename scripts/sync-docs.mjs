#!/usr/bin/env node
/**
 * Sync published docs from product repos into the Docusaurus tree.
 *
 * The source of truth for each doc lives in its product repo. This script
 * copies the designated public docs in, rewrites their cross-links, and stamps
 * Docusaurus frontmatter. Generated files carry an AUTO-GENERATED banner and
 * ARE committed to this repo, so the GitHub Actions build does not need access
 * to the (often private) product repos. Re-run whenever upstream docs change.
 *
 *   npm run sync
 *   PLANS_REPO=/path/to/plans npm run sync   # override a source location
 *
 * If a product repo is not found locally, that product is skipped with a
 * warning and its committed docs are left untouched (so CI builds never fail
 * just because the source checkout is absent).
 */

import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// ── Sources ────────────────────────────────────────────────────────────────
// One block per product. `repo` may be overridden by an env var so the same
// script works locally (sibling checkout) and in CI (a cloned path). Each doc
// becomes docs/<slug>/<dest>.
const PRODUCTS = [
  {
    slug: 'plans',
    repo: process.env.PLANS_REPO ?? resolve(REPO_ROOT, '..', 'plans'),
    docs: [
      {
        src: 'docs/public/installation.md',
        dest: 'installation.md',
        sidebar_label: 'Installation',
        sidebar_position: 1,
        description: 'Install the Plans LQ app + package and wire the backend.',
      },
      {
        src: 'docs/public/connect-stripe.md',
        dest: 'connect-stripe.md',
        sidebar_label: 'Connect Stripe',
        sidebar_position: 2,
        description: 'Connect your Stripe account and finish Plans LQ setup.',
      },
      {
        src: 'docs/public/plans-setup.md',
        dest: 'plans-setup.md',
        sidebar_label: 'Creating plans',
        sidebar_position: 3,
        description: 'Create plans and display them with a widget or your own design.',
      },
      {
        src: 'docs/public/settings.md',
        dest: 'settings.md',
        sidebar_label: 'Settings',
        sidebar_position: 4,
        description: 'Behavior options: checkout, Billing Portal, tax, promo codes, and the test-mode token.',
      },
      {
        src: 'docs/public/usage-limits.md',
        dest: 'usage-limits.md',
        sidebar_label: 'Usage limits',
        sidebar_position: 5,
        description: 'Cap how many items a member can create, per plan.',
      },
      {
        src: 'docs/public/testing.md',
        dest: 'testing.md',
        sidebar_label: 'Testing',
        sidebar_position: 6,
        description: 'Run a full subscribe-to-role flow with a Stripe test account.',
      },
      {
        src: 'docs/public/developers.md',
        dest: 'developers.md',
        sidebar_label: 'For developers',
        sidebar_position: 7,
        description: 'Extension points such as a custom webhook logger.',
      },
    ],
  },
];

const exists = async (p) => {
  try {
    await access(p, constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

/**
 * Rewrite Markdown links so the synced doc resolves cleanly inside Docusaurus:
 *   - external / anchor / absolute links are left untouched
 *   - links to a doc we also sync are pointed at its generated filename
 *   - links to any other local *.md file are unwrapped to plain text, so the
 *     strict broken-links check has nothing to trip on
 */
function rewriteLinks(markdown, linkMap) {
  return markdown.replace(
    /\[([^\]]+)\]\(([^)\s]+)(\s+"[^"]*")?\)/g,
    (match, text, target) => {
      if (/^(https?:|mailto:|tel:|#|\/)/.test(target)) return match;
      const [path, hash] = target.split('#');
      const base = basename(path).toLowerCase();
      const anchor = hash ? `#${hash}` : '';
      if (linkMap.has(base)) return `[${text}](./${linkMap.get(base)}${anchor})`;
      if (base.endsWith('.md')) return text; // unknown local doc → keep text, drop link
      return match;
    },
  );
}

function frontmatter(doc, product) {
  return [
    '---',
    `sidebar_label: ${JSON.stringify(doc.sidebar_label)}`,
    `sidebar_position: ${doc.sidebar_position}`,
    `description: ${JSON.stringify(doc.description)}`,
    '---',
    '',
    `<!-- AUTO-GENERATED from ${product.slug} (${doc.src}). Do not edit here — run \`npm run sync\`. -->`,
    '',
    '',
  ].join('\n');
}

async function syncProduct(product) {
  if (!(await exists(product.repo))) {
    console.warn(
      `⚠  ${product.slug}: source repo not found at ${product.repo} — keeping committed docs.`,
    );
    return 0;
  }

  const outDir = resolve(REPO_ROOT, 'docs', product.slug);
  await mkdir(outDir, { recursive: true });

  const linkMap = new Map(
    product.docs.map((d) => [basename(d.src).toLowerCase(), d.dest]),
  );

  let synced = 0;
  for (const doc of product.docs) {
    const srcPath = resolve(product.repo, doc.src);
    if (!(await exists(srcPath))) {
      console.warn(`⚠  ${product.slug}: missing ${doc.src} — skipped.`);
      continue;
    }
    const body = rewriteLinks(await readFile(srcPath, 'utf8'), linkMap);
    await writeFile(resolve(outDir, doc.dest), frontmatter(doc, product) + body, 'utf8');
    console.log(`✓  ${product.slug}/${doc.dest}  ←  ${doc.src}`);
    synced++;
  }
  return synced;
}

let total = 0;
for (const product of PRODUCTS) total += await syncProduct(product);
console.log(`\nDone — ${total} doc(s) synced.`);
