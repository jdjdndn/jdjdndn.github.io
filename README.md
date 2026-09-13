# 优惠券展示站点骨架

这是一个可用于 GitHub Pages 的静态站点骨架，同时支持本地 Node.js 增删改查。

## 功能

- 展示优惠券列表
- 支持新增、编辑、删除、跳转外部链接
- 本地开发时通过 Node.js + JSON 文件持久化
- 构建后可直接部署到 GitHub Pages

## 技术栈

- 前端：原生 HTML / CSS / JS
- 构建：Vite
- 后端：Node.js + Express
- 数据存储：`data/coupons.json`

## 目录结构

```
├── data/
│   └── coupons.json        # 优惠券数据
├── public/                 # 前端源码
│   ├── index.html
│   ├── app.js
│   └── style.css
├── docs/                   # 构建产物（GitHub Pages 可从该目录部署）
├── server.js               # 本地 Node API 服务
├── vite.config.js
└── package.json
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动本地开发

```bash
npm run dev
```

默认会同时启动：

- Node API 服务：`http://localhost:3000`
- Vite 前端开发服务：`http://localhost:5173`

Vite 已配置代理，`/api/*` 请求会自动转发到 Node 服务。

### 3. 仅启动 Node 服务

```bash
npm start
```

### 4. 构建静态站点

```bash
npm run build
```

构建产物会输出到 `docs/` 目录。

## GitHub Pages 部署

推荐在 GitHub 仓库设置中：

- **Source**: Deploy from a branch
- **Branch**: `main`
- **Folder**: `/ docs`

然后执行：

```bash
npm run build
git add .
git commit -m "build: update static site"
git push
```

## 数据说明

- 本地开发时，所有增删改查操作都会写入 `data/coupons.json`
- 部署到 GitHub Pages 后为纯静态站点，不包含 Node 服务
- 如果需要线上持久化，可替换为 localStorage / GitHub API / 其他后端服务

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/coupons` | 获取全部优惠券 |
| GET | `/api/coupons/:id` | 获取单个优惠券 |
| POST | `/api/coupons` | 新增优惠券 |
| PUT | `/api/coupons/:id` | 更新优惠券 |
| DELETE | `/api/coupons/:id` | 删除优惠券 |

## License

MIT
