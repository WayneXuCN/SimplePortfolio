<p align="center">
  <img src="public/assets/img/website.png" alt="Starter Theme 预览" width="800" />
</p>

<h1 align="center">Starter Theme</h1>

<p align="center">
  <strong>基于 Astro 5 构建的现代极简个人主页主题</strong>g
</p>

<p align="center">
  <a href="https://github.com/WayneXuCN/starter-theme/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" />
  </a>
  <a href="https://astro.build/">
    <img src="https://img.shields.io/badge/Astro-5.x-ff5d01.svg?logo=astro" alt="Astro" />
  </a>
  <a href="https://react.dev/">
    <img src="https://img.shields.io/badge/React-19.x-61dafb.svg?logo=react" alt="React" />
  </a>
  <a href="https://tailwindcss.com/">
    <img src="https://img.shields.io/badge/Tailwind-3.x-38bdf8.svg?logo=tailwindcss" alt="Tailwind CSS" />
  </a>
  <a href="https://bun.sh/">
    <img src="https://img.shields.io/badge/Bun-1.x-fbf0df.svg?logo=bun" alt="Bun" />
  </a>
</p>

<p align="center">
  <a href="#特性">特性</a> •
  <a href="#快速开始">快速开始</a> •
  <a href="#配置">配置</a> •
  <a href="#自定义">自定义</a>
</p>

<p align="center">
  <a href="README.md">English</a> | <a href="README_zh.md">中文</a>
</p>

---

## 特性

| 特性 | 说明 |
|------|------|
| **国际化支持** | 基于 Astro 原生 i18n 路由和内容集合的多语言支持 |
| **深色模式** | 自动检测系统偏好，支持 localStorage 持久化 |
| **响应式设计** | 、适配各种设备 |
| **RSS 聚合** | 从外部 RSS/Atom 源获取并展示文章 |
| **联系表单** | 预配置 EmailJS 集成，开箱即用 |
| **数据分析** | 可选的 Google Analytics 4 集成 |
| **群岛架构** | React 组件按需加载，最小化 JS 体积 |

## 快速开始

### 环境要求

- [Bun](https://bun.sh/) 1.0+（推荐）或 [Node.js](https://nodejs.org/) 18+

### 创建站点

```bash
# 克隆模板
git clone https://github.com/WayneXuCN/starter-theme.git my-site
cd my-site

# 安装依赖
bun install

# 启动开发服务器
bun run dev
```

在浏览器中打开 [http://localhost:4321](http://localhost:4321) 查看效果。

### 构建生产版本

```bash
bun run build
```

输出文件生成在 `dist/` 目录，可部署到任意静态托管平台。

## 项目结构

```text
starter-theme/
├── src/
│   ├── components/astro/     # React 群岛组件
│   │   ├── HeaderBar.jsx     # 导航头部
│   │   ├── Hero.jsx          # Hero 区块
│   │   ├── Footer.jsx        # 页脚
│   │   ├── ThemeToggle.jsx   # 主题切换
│   │   ├── LanguageSwitcher.jsx # 语言切换
│   │   └── ...
│   ├── content/
│   │   └── i18n/             # 翻译文件（内容集合）
│   │       ├── en.json
│   │       └── zh.json
│   ├── layouts/
│   │   └── BaseLayout.astro  # 全局 HTML 布局
│   ├── lib/
│   │   └── i18n.ts           # i18n 工具函数
│   ├── pages/
│   │   ├── index.astro       # 根路径重定向
│   │   ├── 404.astro         # 错误页面
│   │   ├── en/               # 英文路由
│   │   └── zh/               # 中文路由
│   ├── middleware.ts         # Middleware 路由重定向 
│   ├── env.d.ts              # TypeScript 类型声明
│   └── content.config.ts     # 内容集合 Schema
├── public/                   # 静态资源
├── scripts/
│   └── fetch-rss.bun.js      # RSS 聚合脚本
├── astro.config.mjs          # Astro 配置
├── tailwind.config.mjs       # Tailwind 配置
└── package.json
```

## 配置

### 环境变量

在项目根目录创建 `.env` 文件：

```env
# EmailJS（联系表单必需）
PUBLIC_EMAILJS_SERVICE_ID=your_service_id
PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key

# Google Analytics（可选）
PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 站点配置

编辑 `astro.config.mjs` 更新站点 URL：

```js
export default defineConfig({
  site: 'https://your-domain.com',
  // ...
});
```

### 内容管理

所有站点内容通过 `src/content/i18n/` 中的 JSON 文件管理：

| 文件 | 说明 |
|------|------|
| `zh.json` | 中文内容 |
| `en.json` | 英文内容 |

文件结构：

```json
{
  "site": { "title": "...", "description": "...", "author": "..." },
  "nav": [{ "label": "首页", "href": "index.html" }],
  "header": { "name": "...", "avatar": "..." },
  "hero": { "title": "...", "subtitle": "...", "description": "..." },
  "websites": { "title": "...", "items": [...] },
  "featuredPosts": { "title": "...", "rss": {...}, "items": [...] },
  "footer": { "copyright": "...", "socialLinks": [...] },
  "about": { ... },
  "contact": { ... }
}
```

### RSS 订阅

在语言 JSON 文件中配置 RSS 聚合：

```json
{
  "featuredPosts": {
    "rss": {
      "enabled": true,
      "feeds": [
        { "url": "https://blog.example.com/feed.xml", "parser": "default" }
      ],
      "limit": 6
    }
  }
}
```

## 自定义

### 添加新语言

1. **更新 Astro 配置**（`astro.config.mjs`）：

   ```js
   i18n: {
     defaultLocale: 'zh',
     locales: ['zh', 'en', 'ja'],
     routing: { prefixDefaultLocale: true },
   },
   ```

2. **更新 i18n 工具**（`src/lib/i18n.ts`）：

   ```ts
   export const locales = ['zh', 'en', 'ja'] as const;
   
   export const localeConfig = {
     // ...现有语言
     ja: { label: '日', name: '日本語', hrefLang: 'ja' },
   };
   ```

3. **创建翻译文件**（`src/content/i18n/ja.json`）

4. **创建页面路由**（`src/pages/ja/`）

### 样式定制

- **颜色与主题**：编辑 `tailwind.config.mjs`
- **全局样式**：编辑 `src/styles/global.css`
- **深色模式**：使用 Tailwind 的 `dark:` 前缀

### 组件说明

所有交互组件位于 `src/components/astro/`：

| 组件 | 用途 |
|------|------|
| `HeaderBar.jsx` | 导航头部，含语言切换 |
| `Hero.jsx` | Hero 区块，标题与 CTA |
| `Home.jsx` | 首页布局 |
| `About.jsx` | 关于页面内容 |
| `Contact.jsx` | 联系页面与表单 |
| `Footer.jsx` | 页脚 |
| `ThemeToggle.jsx` | 深色/浅色模式切换 |
| `LanguageSwitcher.jsx` | 语言选择器 |
| `PrimaryNav.jsx` | 主导航 |

## 脚本命令

| 命令 | 说明 |
|------|------|
| `bun run dev` | 启动开发服务器 |
| `bun run build` | 构建生产版本 |
| `bun run preview` | 预览生产构建 |
| `bun run fetch:rss` | 抓取 RSS 订阅 |
| `bun run format` | 使用 Prettier 格式化代码 |

## 技术栈

- **框架**：[Astro](https://astro.build/) 5.x
- **UI**：[React](https://react.dev/) 19.x
- **样式**：[Tailwind CSS](https://tailwindcss.com/) 3.x
- **运行时**：[Bun](https://bun.sh/) 1.x
- **邮件**：[EmailJS](https://www.emailjs.com/)

## 贡献指南

欢迎贡献！提交 PR 前请阅读 [贡献指南](CONTRIBUTING.md)。

1. Fork 本仓库
2. 创建功能分支（`git checkout -b feature/amazing-feature`）
3. 提交更改（`git commit -m 'Add amazing feature'`）
4. 推送到分支（`git push origin feature/amazing-feature`）
5. 发起 Pull Request

## 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

---

<p align="center">
  Made with love by <a href="https://github.com/WayneXuCN">Wenjie Xu</a>
</p>
