# Project Plan

> Status: **implementing**
> Created: 2026-09-23
> Last Updated: 2026-09-23

## Objective

将现有静态 HTML 多页面应用（MPA）改造为 Vue 3 + Vue Router + Pinia + 预渲染的单页应用（SPA），解决路由、状态管理、跨页面通信问题，同时保持 SEO 兼容性。

## 项目现状分析

- **技术栈**：纯 HTML/CSS/JS + Vite
- **页面数量**：12个主页面 + 920个文章页面
- **核心页面**：index, haoka, haoka-agent, huodong, huiyuan, wangpan, wifi, about, fuye, gouwu, privacy, qunliao
- **文章页面**：src/article/ 目录下大量静态文章
- **公共组件**：common/, public/ 目录下的 CSS/JS

## Tasks

### Phase 1: 项目初始化

- [x] Task 1.1 — 安装 Vue 3、Vue Router、Pinia 依赖
  - Depends on: nothing
  - Completed: 2026-09-23
- [x] Task 1.2 — 创建 Vue 项目结构（src/main.js, src/App.vue）
  - Depends on: Task 1.1
  - Completed: 2026-09-23
- [x] Task 1.3 — 配置 Vite 支持 Vue 单文件组件
  - Depends on: Task 1.2
  - Completed: 2026-09-23
- [ ] Task 1.4 — 配置预渲染插件（prerender-spa-plugin）
  - Depends on: Task 1.3

### Phase 2: 路由配置

- [x] Task 2.1 — 设计路由结构（路由表、嵌套、懒加载）
  - Depends on: Phase 1
  - Completed: 2026-09-23
- [x] Task 2.2 — 创建路由配置文件（src/router/index.js）
  - Depends on: Task 2.1
  - Completed: 2026-09-23
- [x] Task 2.3 — 实现路由守卫（SEO meta 更新、权限控制）
  - Depends on: Task 2.2
  - Completed: 2026-09-23

### Phase 3: 状态管理

- [x] Task 3.1 — 设计 Pinia store 结构（user, app, cache）
  - Depends on: Phase 1
  - Completed: 2026-09-23
- [x] Task 3.2 — 创建用户状态 store（登录态、收藏、历史）
  - Depends on: Task 3.1
  - Completed: 2026-09-23
- [x] Task 3.3 — 创建应用状态 store（主题、设置、全局配置）
  - Depends on: Task 3.1
  - Completed: 2026-09-23

### Phase 4: 页面迁移（核心页面）

- [x] Task 4.1 — 迁移 index.html → Home.vue
  - Depends on: Phase 2, Phase 3
  - Completed: 2026-09-23
- [x] Task 4.2 — 迁移 haoka.html → Haoka.vue
  - Depends on: Task 4.1
  - Completed: 2026-09-23
- [x] Task 4.3 — 迁移 haoka-agent.html → HaokaAgent.vue
  - Depends on: Task 4.1
  - Completed: 2026-09-23
- [x] Task 4.4 — 迁移 huodong.html → Huodong.vue
  - Depends on: Task 4.1
  - Completed: 2026-09-23
- [x] Task 4.5 — 迁移 huiyuan.html → Huiyuan.vue
  - Depends on: Task 4.1
  - Completed: 2026-09-23
- [x] Task 4.6 — 迁移 wangpan.html → Wangpan.vue
  - Depends on: Task 4.1
  - Completed: 2026-09-23
- [x] Task 4.7 — 迁移 wifi.html → Wifi.vue
  - Depends on: Task 4.1
  - Completed: 2026-09-23
- [x] Task 4.8 — 迁移 about.html → About.vue
  - Depends on: Task 4.1
  - Completed: 2026-09-23
- [x] Task 4.9 — 迁移 fuye.html → Fuye.vue
  - Depends on: Task 4.1
  - Completed: 2026-09-23
- [x] Task 4.10 — 迁移 gouwu.html → Gouwu.vue
  - Depends on: Task 4.1
  - Completed: 2026-09-23
- [x] Task 4.11 — 迁移 privacy.html → Privacy.vue
  - Depends on: Task 4.1
  - Completed: 2026-09-23
- [x] Task 4.12 — 迁移 qunliao.html → Qunliao.vue
  - Depends on: Task 4.1
  - Completed: 2026-09-23

### Phase 5: 文章页面处理

- [ ] Task 5.1 — 设计文章页面路由方案（动态路由 + 预渲染）
  - Depends on: Phase 4
- [ ] Task 5.2 — 创建文章详情页组件（Article.vue）
  - Depends on: Task 5.1
- [ ] Task 5.3 — 配置文章页面预渲染列表
  - Depends on: Task 5.2

### Phase 6: 公共组件迁移

- [x] Task 6.1 — 迁移导航组件（site-nav）
  - Depends on: Phase 4
  - Completed: 2026-09-23
- [x] Task 6.2 — 迁移页头组件（page-hero）
  - Depends on: Task 4.1
  - Completed: 2026-09-23
- [x] Task 6.3 — 迁移页脚组件（footer）
  - Depends on: Task 4.1
  - Completed: 2026-09-23
- [x] Task 6.4 — 迁移深色模式切换组件
  - Depends on: Task 6.1
  - Completed: 2026-09-23

### Phase 6.5: 副业二级页面迁移

- [x] Task 6.5.1 — 创建通用副业页面组件（FuyePage.vue）
  - Depends on: Phase 4
  - Completed: 2026-09-23
- [x] Task 6.5.2 — 创建副业页面数据配置（fuye-data.js）
  - Depends on: Task 6.5.1
  - Completed: 2026-09-23
- [x] Task 6.5.3 — 配置副业页面路由（动态路由 /fuye/:slug.html）
  - Depends on: Task 6.5.2
  - Completed: 2026-09-23

### Phase 7: SEO 和 GEO 优化

- [ ] Task 7.1 — 配置路由 meta 信息（title, description, keywords）
  - Depends on: Phase 4
- [ ] Task 7.2 — 实现 SEO meta 动态更新（vue-meta 或 unhead）
  - Depends on: Task 7.1
- [ ] Task 7.3 — 配置预渲染路由列表
  - Depends on: Task 7.2
- [ ] Task 7.4 — 验证 GEO meta 标签正确性
  - Depends on: Task 7.3

### Phase 8: 测试验证

- [ ] Task 8.1 — 本地开发测试（所有页面路由跳转）
  - Depends on: Phase 7
- [ ] Task 8.2 — 构建测试（预渲染输出验证）
  - Depends on: Task 8.1
- [ ] Task 8.3 — SEO 测试（meta 标签、结构化数据）
  - Depends on: Task 8.2
- [ ] Task 8.4 — 性能测试（首屏加载、打包体积）
  - Depends on: Task 8.3

## Architecture Decisions

| Decision | Options Considered | Chosen | Rationale |
|----------|-------------------|--------|-----------|
| 前端框架 | Vue 3, React, Svelte | Vue 3 | 更轻量，适合内容型网站，学习曲线平缓 |
| 路由方案 | Vue Router, React Router, Nuxt | Vue Router | 官方支持，配置灵活，与 Vue 3 深度集成 |
| 状态管理 | Pinia, Vuex, Zustand | Pinia | 新一代方案，TypeScript 友好，更简洁 |
| UI组件库 | Naive UI, Element Plus, Vuetify | Naive UI | Vue 3 原生、轻量、主题定制灵活 |
| 预渲染 | prerender-spa-plugin, Nuxt, Netlify | prerender-spa-plugin | 与现有 Vite 构建流程兼容，无需迁移平台 |
| 文章页面 | 动态路由, 静态生成, 混合 | 动态路由 + 预渲染 | 保持 URL 不变，SEO 兼容 |

## Open Questions

- [ ] 文章页面是否需要保留原 URL 路径（/article/xxx.html → /article/xxx）？
- [ ] 是否需要实现文章分类/标签功能？
- [ ] 是否需要实现文章搜索功能？
- [ ] 是否需要实现用户评论系统？

## 审查意见

### 问题1：预渲染方案与现有实现冲突

**现状**：项目已有自定义 `seo-prerender` 插件，通过 `transformIndexHtml` 在构建时注入静态 HTML 内容。

**问题**：`prerender-spa-plugin` 是在构建后使用 Puppeteer 预渲染，与现有机制可能冲突。

**建议**：
- 方案A：保留现有 `seo-prerender` 插件，在 Vue 组件中保留 `<main id="tab-content">` 结构
- 方案B：迁移到 `prerender-spa-plugin`，移除现有插件
- 方案C：使用 Nuxt.js 的混合渲染（SSG + SSR）

### 问题2：文章页面数量庞大（920个）

**问题**：预渲染 920 个页面会导致构建时间极长（每个页面需要 Puppeteer 实例）。

**建议**：
- 仅预渲染核心页面（12个主页面）
- 文章页面保持动态路由，使用 `prerender-spa-plugin` 的 `postProcess` 钩子生成静态 HTML
- 或考虑使用 Netlify/Vercel 的边缘缓存 + ISR（增量静态再生）

### 问题3：现有 Vite 插件兼容性

**现状**：项目有 7 个自定义 Vite 插件：
- `injectBuildDate` - 注入构建日期
- `seoPrerender` - SEO 预渲染
- `cacheControlMeta` - 缓存控制
- `generateSitemap` - 生成 sitemap
- `generateLlms` - 生成 LLMs 文件
- `swHash` - Service Worker 哈希
- `verifyAssets` - 资源验证

**问题**：迁移到 Vue SPA 后，这些插件可能需要调整。

**建议**：逐一测试每个插件的兼容性，必要时重写。

### 问题4：页面结构不统一

**观察**：不同页面的 HTML 结构差异较大：
- `index.html` 使用 `<main id="tab-content">` 作为内容容器
- `haoka.html` 使用 `<section class="container">` 作为内容容器
- 其他页面结构各异

**建议**：在迁移前先统一页面结构模板，减少迁移工作量。

### 问题5：CSS/JS 资源路径

**现状**：CSS/JS 文件分布在 `src/`、`public/`、`common/` 目录，路径引用方式不统一。

**建议**：迁移时统一使用相对路径或配置别名。

### 优先级调整建议

| 阶段 | 建议调整 |
|------|---------|
| Phase 1 | 增加：评估现有 Vite 插件兼容性 |
| Phase 4 | 增加：统一页面结构模板 |
| Phase 5 | 重新设计：文章页面预渲染策略 |
| Phase 7 | 增加：测试现有 Vite 插件是否正常工作 |

### 风险提示

1. **构建时间**：预渲染大量页面会导致构建时间从分钟级增加到小时级
2. **内存消耗**：Puppeteer 实例会消耗大量内存，可能导致构建失败
3. **SEO 回归**：迁移过程中如果 meta 标签处理不当，可能导致 SEO 排名下降
4. **URL 变化**：SPA 路由可能改变 URL 结构，影响已有外链

## Progress Log

| Date | Update |
|------|--------|
| 2026-09-23 | 创建项目计划，完成现状分析 |
| 2026-09-23 | 完成审查，识别 5 个问题和风险 |
| 2026-09-23 | Phase 1: 安装 Vue 3、Vue Router、Pinia 依赖，创建项目结构 |
| 2026-09-23 | Phase 2: 创建路由配置，实现 SEO meta 更新守卫 |
| 2026-09-23 | Phase 3: 创建用户状态 store 和应用状态 store |
| 2026-09-23 | Phase 4: 完成所有 12 个核心页面 Vue 组件创建 |
| 2026-09-23 | Phase 6: 完成 SiteNav、PageHero、LegalLinks 组件迁移 |
| 2026-09-23 | 安装 Naive UI 组件库 |
| 2026-09-23 | 完成所有页面 Naive UI 组件替换 |
| 2026-09-23 | 构建成功验证通过 |
| 2026-09-23 | Phase 6.5: 完成副业二级页面迁移（FuyePage.vue + 动态路由） |
| 2026-09-23 | 完成 CSS/JS 文件整合：Haoka.vue、Wangpan.vue、Wifi.vue、Huiyuan.vue、Gouwu.vue |
| 2026-09-23 | 删除已整合的原始 CSS/JS 文件：haoka.css/js、wangpan.css/js、wifi.css/js、huiyuan.css/js、gouwu.css/js |
