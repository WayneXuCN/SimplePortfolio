/**
 * src/middleware.ts
 * 功能：
 * 1. 根路径重定向到默认语言
 * 2. 语言检测与路由验证
 */
import { defineMiddleware } from 'astro:middleware';
import { defaultLocale, isValidLocale } from './lib/i18n';

/**
 * 从路径中提取语言代码
 */
function extractLocaleFromPath(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean);
  return segments[0] || null;
}

/**
 * 主中间件函数
 *
 * 处理逻辑：
 * 1. 静态资源直接放行
 * 2. 根路径 "/" 重定向到默认语言
 * 3. 验证语言路径有效性
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const { url, redirect } = context;
  const pathname = url.pathname;

  // 1. 静态资源和特殊路径直接放行
  if (
    pathname.startsWith('/_') || // Astro 内部路由
    pathname.startsWith('/assets/') || // 静态资源
    pathname.startsWith('/api/') || // API 端点
    pathname.includes('.') || // 带扩展名的文件
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/site.webmanifest'
  ) {
    return next();
  }

  // 2. 根路径重定向到默认语言
  // 官方推荐：使用 redirect() 而非 meta refresh
  if (pathname === '/') {
    return redirect(`/${defaultLocale}/`, 302);
  }

  // 3. 提取并验证语言代码
  const pathLocale = extractLocaleFromPath(pathname);

  // 如果路径以有效语言开头，继续处理
  if (pathLocale && isValidLocale(pathLocale)) {
    return next();
  }

  // 4. 无效语言路径，重定向到默认语言的对应页面
  // 例如：/about/ -> /zh/about/
  const newPath = `/${defaultLocale}${pathname}`;
  return redirect(newPath, 302);
});
