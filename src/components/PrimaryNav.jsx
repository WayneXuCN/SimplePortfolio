import React from 'react';
import { useLanguage } from '../lib/LanguageContext.jsx';

const PrimaryNav = () => {
  const { content } = useLanguage();
  const navLinks = content?.nav || [];

  const currentPath =
    typeof window !== 'undefined' ? window.location.pathname : '';

  const isActive = (href) => {
    if (!currentPath) return false;
    // 移除开头的斜杠以进行统一比较，处理本地文件路径或服务器路径
    const path = currentPath.split('/').pop() || '';

    if (href === 'index.html') {
      return path === '' || path === 'index.html';
    }
    return path === href;
  };

  return (
    <nav className="flex flex-wrap items-center gap-8 text-base font-medium text-gray-600 dark:text-gray-300">
      {navLinks.map((link, index) => {
        const active = isActive(link.href);
        return (
          <React.Fragment key={link.href}>
            {index > 0 && (
              <span className="text-gray-300 dark:text-gray-600 select-none">
                /
              </span>
            )}
            <a
              href={link.href}
              className={`relative group transition-colors py-1 ${
                active
                  ? 'text-black dark:text-white font-bold'
                  : 'hover:text-black dark:hover:text-white'
              }`}
            >
              {link.label}
              <span
                className={`absolute bottom-0 left-0 h-[2px] bg-black dark:bg-white transition-all duration-300 ease-out ${
                  active ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              ></span>
            </a>
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default PrimaryNav;
