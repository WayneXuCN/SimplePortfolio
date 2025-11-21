# Simple Portfolio

[English](README.md) | [中文](README_zh.md)

一个简单的、响应式的个人网站，使用 **Next.js** 和 **Tailwind CSS** 构建。

## 预览

![网站预览](public/assets/img/website.png)

## 项目结构

```text
src/
├── app/                 # Next.js App Router
│   ├── (main)/          # 主路由组 (包含页头/页脚)
│   │   ├── about/       # 关于页面
│   │   ├── contact/     # 联系页面
│   │   └── page.jsx     # 首页
│   ├── globals.css      # 全局样式
│   ├── layout.jsx       # 根布局 (仅包含 Providers)
│   └── not-found.jsx    # 404页面 (独立布局)
├── components/
│   ├── About.jsx        # 关于部分组件
│   ├── App.jsx          # 主应用组件 (旧版/重构版)
│   ├── Contact.jsx      # 联系部分组件
│   ├── HeaderBar.jsx    # 导航栏
│   ├── Hero.jsx         # 主横幅部分
│   ├── Layout.jsx       # 主布局包装器
│   └── ...
├── lib/                 # 工具和上下文
│   ├── LanguageContext.jsx
│   └── ThemeContext.jsx
├── locales/             # 语言配置
│   ├── config.js        # 语言配置入口
│   ├── en.json          # 英文内容
│   └── zh.json          # 中文内容
└── styles/              # 额外样式
```

## 开发

1. **安装依赖**:

   ```bash
   npm install
   ```

2. **运行开发服务器**:

   ```bash
   npm run dev
   ```

   在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看。

## 构建与部署

创建生产构建（静态导出）：

```bash
npm run build
```

静态文件将生成在 `out/` 目录中。

## 配置

- **内容**: 编辑 `src/locales/` 目录下的文件 (`zh.json`, `en.json`) 来更新网站内容（文本、链接、图片）。
- **环境变量**:
  - 根据 `.env.example`（如果可用）创建 `.env` 文件，或直接添加您的密钥。
  - 联系表单需要：
    - `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
    - `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
    - `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`
  - Google Analytics (可选):
    - `NEXT_PUBLIC_GA_ID` (例如: `G-XXXXXXXXXX`)

## 许可证

本项目采用 MIT 许可证。详情请参阅 [LICENSE](LICENSE) 文件。
