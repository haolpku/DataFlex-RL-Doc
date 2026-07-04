# DataFlex-RL 文档

**[DataFlex-RL](https://github.com/haolpku/DataFlex-RL)** 的文档站 —— 面向 LLM 强化学习
微调的数据调度(选择 · 混合 · 重加权),一个零侵入的 [verl](https://github.com/volcengine/verl) 插件。

🌐 **在线站点:https://haolpku.github.io/DataFlex-RL-Doc/**

双语(English / 中文),基于 [VuePress](https://vuepress.vuejs.org/) +
[vuepress-theme-plume](https://theme-plume.vuejs.press/) 构建,结构沿用
[OpenDCAI/DataFlex-Doc](https://github.com/OpenDCAI/DataFlex-Doc)(SFT 项目的文档),
重新落在 RL 框架上。

## 内容

| 章节 | 页面 |
|---|---|
| **基础信息** | 简介 · 框架设计(Scorer/Actuator、verl 挂载点、时序模型)· 安装 |
| **Reweighter** | 快速开始 · 添加 Reweighter · Advantage Reweighting |
| **Selector** | 快速开始 · 添加 Selector · Online Difficulty Filtering |
| **Mixer** | 快速开始 · 添加 Mixer · DUMP(UCB) |

## 本地开发

```sh
npm ci                 # 按 package-lock.json 安装锁定依赖
npm run docs:dev       # 开发服务器,热更新预览 markdown 修改
npm run docs:build     # 生产构建;推送前跑一次,提前发现渲染错误
```

内容在 `docs/en/notes/guide/` 和 `docs/zh/notes/guide/`(每个 `.md` 一页,中英各一份)。
站点配置在 `docs/.vuepress/`:导航栏 [`navbars/`](./docs/.vuepress/navbars/)、侧边栏
[`notes/`](./docs/.vuepress/notes/)(按机制分组)、主题/base/标题在
[`config.ts`](./docs/.vuepress/config.ts) 和 `plume.config.ts`。

每个 markdown 头部的 frontmatter 决定侧边栏标题、图标和 URL:

```yaml
---
title: 框架设计                  # 侧边栏标题
createTime: 2026/07/03 10:00:00
icon: material-symbols:auto-transmission-sharp   # 图标从 https://icon-sets.iconify.design/ 选
permalink: /zh/guide/basicinfo/framework/        # 简洁 URL,须唯一
---
```

## 部署到 GitHub Pages

`.github/workflows/deploy.yml` 会在每次 push 到 `main` 时构建并把静态产物推到
`gh-pages` 分支。需要在仓库里做两处一次性设置:

- **Settings → Actions → General → Workflow permissions**:勾选 **Read and write permissions**,保存。
- **Settings → Pages → Build and deployment → Source**:选 **Deploy from a branch**,
  分支 **`gh-pages`** `/ (root)`,保存。

> 不要把 Pages 的 Source 选成 "GitHub Actions" —— 本 workflow 发布到 `gh-pages` 分支,
> 必须用 "Deploy from a branch" 来服务。

## 相关链接

- 主项目:https://github.com/haolpku/DataFlex-RL
- verl:https://github.com/volcengine/verl
- 原始 DataFlex(SFT):https://github.com/OpenDCAI/DataFlex
