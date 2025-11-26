/**
 * HeaderBar.jsx
 * 头部组件，包含 avatar、name、导航、主题切换和语言切换
 */
import React from 'react';
import PrimaryNav from './PrimaryNav.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import ThemeToggle from './ThemeToggle.jsx';

const HeaderBar = ({ header, nav, currentPath = '/', lang = 'en' }) => {
  const avatarUrl = header?.avatar || '/assets/img/prof_pic.png';
  const name = header?.name || '';

  return (
    <header className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12 sm:mb-16 md:mb-20 animate-fade-in'>
      <div className='flex items-center'>
        <img
          src={avatarUrl}
          alt={name}
          width={56}
          height={56}
          className='w-12 h-12 sm:w-14 sm:h-14 rounded-full mr-3 sm:mr-4 shadow-sm object-cover'
          loading='eager'
          decoding='async'
        />
        <span className='font-medium text-gray-900 dark:text-white text-lg tracking-tight'>
          {name}
        </span>
      </div>
      <div className='flex flex-wrap justify-center items-center gap-y-4 gap-x-4 sm:gap-8'>
        <PrimaryNav nav={nav} currentPath={currentPath} lang={lang} />
        <div className='flex items-center gap-2'>
          <ThemeToggle />
          <LanguageSwitcher currentLang={lang} />
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
