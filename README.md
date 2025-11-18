# 个人主页

使用 React 19、Tailwind CSS 3 和 esbuild 构建的多页面静态站点。

## 快速开始

```bash
npm install       # 安装依赖
npm run dev       # 本地开发（监听 JS + CSS）
npm run build     # 生产构建（assets/css + assets/js）
```

> 提交代码或部署前请务必运行一次 `npm run build`，以便生成最新的静态资源。

## 项目结构

```text
├── assets/                # 构建产物，直接给静态服务器使用
│   ├── css/
│   │   ├── custom-icons.css
│   │   └── main.css
│   └── js/
│       ├── app.bundle.js
│       ├── app.bundle.js.map
│       └── underline-effects.js
├── src/                   # 源码目录
│   ├── components/        # React 组件
│   ├── lib/               # 工具与配置
│   └── styles/            # Tailwind 入口与自定义样式
├── *.html                 # 多页面入口（index/about/contact/404）
├── content.json           # 主页动态数据源
├── tailwind.config.js
└── postcss.config.js
```

## 开发约定

- **React 模块化**：`src/components` / `src/lib` 中维护逻辑与组件，构建后输出到 `assets/js/app.bundle.js`。
- **统一样式管线**：所有 Tailwind 与自定义样式写在 `src/styles/main.css`，构建后得到 `assets/css/main.css`。
- **静态页复用**：`about.html`、`contact.html`、`404.html` 等直接引用同一份 CSS/JS，保持体验一致。
- **CI & 部署**：GitHub Actions 会执行 `npm ci` + `npm run build`，服务器只需拉取仓库即可使用最新资源。

## 常用脚本

- `npm run dev`：同时监听 React 源码与 Tailwind 样式的改动。
- `npm run build:js`：单独构建 React 代码（esbuild）。
- `npm run build:css`：单独构建 Tailwind（含 PostCSS/Autoprefixer）。
- `npm run watch:*`：分别监听 JS/CSS。

欢迎基于目前的结构继续扩展更多页面或数据源。
