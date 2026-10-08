# 优惠活动聚合

一个用于 GitHub Pages 的静态优惠券聚合站点，收录美团、淘宝、京东、拼多多、携程、滴滴等平台的热门优惠活动。

## 功能

- 分类 Tab 导航，支持全部/美团/淘宝闪购/电商/旅行/出行/餐饮/电影票·快递
- 一键复制口令码，支持小程序口令（`mp://`）
- 链接类优惠支持二维码扫码访问
- 搜索优惠名称、口令码、分类
- 过期优惠自动标记，支持一键隐藏
- 暗色模式（手动切换 / 跟随系统）
- 分享按钮（Web Share API / 剪贴板兜底）
- 移动端适配，底部友情链接可收起
- 暗色模式、可访问性增强、键盘快捷键（`/` 聚焦搜索）

## 技术栈

- 前端：Vue 3 + vue-router 4 + Pinia 4
- 构建：Vite 5（含 8 个自定义插件，见 `scripts/vite-plugins/`）
- 二维码：qrcode（本地生成）
- 预渲染 / 冒烟测试：Playwright
- 图片压缩：sharp
- 部署：GitHub Pages / Cloudflare Pages（wrangler）

## 目录结构

```
├── src/                   # 前端源码
│   ├── index.html         # SPA 入口
│   ├── main.js            # 应用挂载（createApp + Pinia + router）
│   ├── App.vue            # 根组件
│   ├── router/            # vue-router 路由配置
│   ├── stores/            # Pinia 状态（app / user）
│   ├── views/             # 页面视图组件
│   ├── components/        # 可复用 UI 组件
│   ├── composables/       # 组合式函数（useToast / useClipboard / useShare …）
│   ├── utils/             # 工具函数
│   ├── templates/         # 构建时生成的页面模板
│   ├── article/           # 静态文章 HTML
│   ├── data.js            # 优惠数据
│   └── shared.css         # 全局样式与 CSS 变量
├── scripts/               # 构建脚本（页面生成 / SEO / 预渲染 …）
│   └── vite-plugins/      # 自定义 Vite 插件
├── vendor/seo-optimizer/  # 内嵌 SEO 优化工具
├── public/                # 静态资源
├── dist/                  # 构建产物（部署目录）
├── vite.config.js
└── package.json
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

Vite 开发服务器启动后，浏览器自动打开 `http://localhost:5173`。

### 构建

```bash
npm run build
```

构建产物输出到 `dist/` 目录。

### 预览构建产物

```bash
npm run preview
```

## GitHub Pages 部署

1. 在 GitHub 仓库设置中：**Settings → Pages → Source** 选择 `Deploy from a branch`
2. **Branch** 选择 `main`，**Folder** 选择 `/ dist`
3. 执行构建并推送：

```bash
npm run build
git add .
git commit -m "build: update static site"
git push
```

## 数据说明

所有优惠数据在 `src/data.js` 中管理，修改此文件即可更新页面内容，无需改动视图组件。

### 数据结构

```js
// tabs: 每个 tab 包含 id / label / sections[]
//   sections[]: 每个分区包含 title / items[]
//     items[]: 每个活动包含 name，以及以下二选一：
//       - code（口令码，用户点击复制；mp:// 开头为小程序口令）
//       - link（链接，用户点击跳转）
//     可选字段：deadline（截止日期，格式 YYYY.MM.DD）

// friendLinks: 友情链接数组
export const friendLinks = [{ name: '站点名', url: 'https://...' }]
```

## License

MIT
