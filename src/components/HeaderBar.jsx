import React from 'react';
import PrimaryNav from './PrimaryNav.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import ThemeToggle from './ThemeToggle.jsx';

const HeaderBar = ({ header }) => (
  <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12 sm:mb-16 md:mb-20 animate-fade-in">
    <div className="flex items-center">
      <img
        src={header.avatar}
        alt={header.name}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full mr-3 sm:mr-4 shadow-sm"
        loading="lazy"
      />
      <span className="font-medium text-gray-900 dark:text-white text-lg tracking-tight">
        {header.name}
      </span>
    </div>
    <div className="flex items-center gap-4 sm:gap-8">
      <PrimaryNav />
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
    </div>
  </header>
);

export default HeaderBar;
