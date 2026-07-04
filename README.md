# DataFlex-RL Documentation

Documentation site for **[DataFlex-RL](https://github.com/haolpku/DataFlex-RL)** —
data scheduling (Select · Mix · Reweight) for RL fine-tuning of LLMs, a zero-fork
plugin for [verl](https://github.com/volcengine/verl).

🌐 **Live site: https://haolpku.github.io/DataFlex-RL-Doc/**

Bilingual (English / 中文), built with [VuePress](https://vuepress.vuejs.org/) and
[vuepress-theme-plume](https://theme-plume.vuejs.press/). The structure mirrors
[OpenDCAI/DataFlex-Doc](https://github.com/OpenDCAI/DataFlex-Doc) (the SFT project's
docs), re-grounded on the RL framework.

## Contents

| Section | Pages |
|---|---|
| **Basic Info** | Introduction · Framework Design (Scorer/Actuator, verl mount points, timing model) · Installation |
| **Reweighter** | Quick Start · Add a Reweighter · Advantage Reweighting |
| **Selector** | Quick Start · Add a Selector · Online Difficulty Filtering |
| **Mixer** | Quick Start · Add a Mixer · DUMP (UCB) |

## Local development

```sh
npm ci                 # install pinned deps (package-lock.json)
npm run docs:dev       # dev server with hot reload (preview markdown edits live)
npm run docs:build     # production build; run before pushing to catch render errors
```

Content lives in `docs/en/notes/guide/` and `docs/zh/notes/guide/` (one page per
`.md`, English + 中文). Site config is under `docs/.vuepress/`:

- **Navbar**: [`docs/.vuepress/navbars/`](./docs/.vuepress/navbars/)
- **Sidebar**: [`docs/.vuepress/notes/`](./docs/.vuepress/notes/) (grouped by mechanism)
- **Theme / base / titles**: [`docs/.vuepress/config.ts`](./docs/.vuepress/config.ts) and `plume.config.ts`

Each markdown page starts with frontmatter that drives the sidebar title, icon, and URL:

```yaml
---
title: Framework Design        # sidebar title
createTime: 2026/07/03 10:00:00
icon: material-symbols:auto-transmission-sharp   # from https://icon-sets.iconify.design/
permalink: /en/guide/basicinfo/framework/        # clean URL; must be unique
---
```

## Deploy (GitHub Pages)

`.github/workflows/deploy.yml` builds the site and pushes the static output to the
`gh-pages` branch on every push to `main`. Two one-time repo settings are required:

- **Settings → Actions → General → Workflow permissions**: select **Read and write permissions**, Save.
- **Settings → Pages → Build and deployment → Source**: select **Deploy from a branch**,
  Branch **`gh-pages`** `/ (root)`, Save.

> Do **not** select "GitHub Actions" as the Pages source — this workflow publishes to
> the `gh-pages` branch, so it must be served via "Deploy from a branch".

## Links

- Main project: https://github.com/haolpku/DataFlex-RL
- verl: https://github.com/volcengine/verl
- Original DataFlex (SFT): https://github.com/OpenDCAI/DataFlex
