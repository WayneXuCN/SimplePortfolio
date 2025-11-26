/**
 * ThemeToggle.jsx
 * 主题切换按钮，支持 light/dark 模式
 * 使用 localStorage 持久化用户偏好
 */
import React, { useState, useEffect, useCallback } from 'react';

const ThemeToggle = () => {
  // 初始状态从 DOM 读取
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
    return 'light';
  });

  // 同步主题状态（处理 SSR hydration）
  useEffect(() => {
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    setTheme(currentTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';

    // 更新 DOM
    document.documentElement.classList.toggle('dark', newTheme === 'dark');

    // 保存到 localStorage
    try {
      localStorage.setItem('theme', newTheme);
    } catch {
      // 忽略 localStorage 错误（如隐私模式）
    }

    setTheme(newTheme);
  }, [theme]);

  const themeLabel = theme === 'light' ? '切换到深色模式' : '切换到浅色模式';

  return (
    <button
      onClick={toggleTheme}
      className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
      aria-label={themeLabel}
      title={themeLabel}
    >
      {theme === 'light' ? (
        // Moon icon for light mode (switch to dark)
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5 text-gray-600 dark:text-gray-300'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
          />
        </svg>
      ) : (
        // Sun icon for dark mode (switch to light)
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5 text-yellow-400'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
          />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
