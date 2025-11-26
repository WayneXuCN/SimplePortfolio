/**
 * LanguageSwitcher.jsx (Astro React Island 版本)
 * 语言切换按钮，用于在 /en/ 和 /zh/ 之间切换
 *
 * 更新：
 * - 支持 View Transitions 的 navigate API
 * - 使用 astro:transitions/client 实现平滑的语言切换
 *
 * 参考文档：
 * - View Transitions Guide - Trigger navigation
 * - Internationalization (i18n) Routing
 */
import React, { useCallback, useEffect, useState } from 'react';

const locales = {
  zh: { label: '中', path: '/zh/' },
  en: { label: 'EN', path: '/en/' },
};

const LanguageSwitcher = ({ currentLang = 'en' }) => {
  // 用于检测 navigate 函数是否可用
  const [navigateAvailable, setNavigateAvailable] = useState(false);

  useEffect(() => {
    // 动态导入 astro:transitions/client 模块
    // 只在客户端执行，避免 SSR 问题
    import('astro:transitions/client')
      .then(() => setNavigateAvailable(true))
      .catch(() => setNavigateAvailable(false));
  }, []);

  // 获取下一个语言
  const getNextLang = () => {
    const localeKeys = Object.keys(locales);
    const currentIndex = localeKeys.indexOf(currentLang);
    const nextIndex = (currentIndex + 1) % localeKeys.length;
    return localeKeys[nextIndex];
  };

  const nextLang = getNextLang();
  const nextLabel = locales[nextLang].label;
  const currentLabel = locales[currentLang].label;

  const handleSwitch = useCallback(async () => {
    // 获取当前路径并替换语言前缀
    const currentPath = window.location.pathname;
    const pathWithoutLang = currentPath.replace(/^\/(en|zh)\//, '/');
    const newPath = `/${nextLang}${pathWithoutLang}`;

    // 如果 View Transitions 的 navigate 可用，使用它进行平滑切换
    if (navigateAvailable) {
      try {
        const { navigate } = await import('astro:transitions/client');
        // 使用 replace 模式，不在历史记录中创建新条目
        // 这样用户按返回键不会在语言间来回切换
        await navigate(newPath, { history: 'replace' });
        return;
      } catch (error) {
        // fallback to normal navigation
        console.warn('View Transitions navigate failed, falling back to normal navigation');
      }
    }

    // Fallback：普通导航
    window.location.href = newPath;
  }, [nextLang, navigateAvailable]);

  return (
    <button
      onClick={handleSwitch}
      className='ml-4 px-3 py-1 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-full transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-gray-500'
      aria-label={`当前语言: ${currentLabel}, 切换到: ${nextLabel}`}
      title={`切换到 ${nextLabel}`}
    >
      {nextLabel}
    </button>
  );
};

export default LanguageSwitcher;
