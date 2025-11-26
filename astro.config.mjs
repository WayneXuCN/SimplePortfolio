import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  // 静态站点生成
  output: 'static',
  
  // 尾部斜杠策略
  trailingSlash: 'always',
  
  // 站点基础配置
  site: 'https://wenjiexu.site', // 在部署时更新为实际域名
  
  // i18n 国际化配置
  // 参考文档：Internationalization (i18n) Routing
  i18n: {
    // 默认语言
    defaultLocale: 'zh',
    // 支持的语言列表
    locales: ['zh', 'en'],
    // 路由配置
    routing: {
      // 默认语言也添加前缀，如 /zh/, /en/
      prefixDefaultLocale: true,
      // 禁用根路径自动重定向，让 / 直接显示首页内容
      redirectToDefaultLocale: false,
    },
  },

  // 自定义重定向配置
  // 覆盖 Astro i18n 默认的 404 重定向行为
  redirects: {
    // 让 /404 直接显示中文 404 页面而不是重定向
    // 需要在服务器端（OpenResty/Nginx）配置 error_page
  },
  
  // Prefetch 预获取配置
  // 参考文档：Prefetch Guide
  // 启用后会自动为带有 data-astro-prefetch 属性的链接添加预获取
  prefetch: {
    // 默认策略：hover - 鼠标悬停时预获取
    // 可选值：'hover' | 'tap' | 'viewport' | 'load'
    defaultStrategy: 'hover',
    // 不自动预获取所有链接，需要手动添加 data-astro-prefetch 属性
    prefetchAll: false,
  },
  
  // 集成配置
  integrations: [
    react(),
    tailwind({
      // 使用自定义配置文件
      configFile: './tailwind.config.mjs',
    }),
  ],
  
  // Vite 配置
  vite: {
    // 优化依赖预构建
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
  },
});