import React from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';
import PrimaryNav from './PrimaryNav.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import ThemeToggle from './ThemeToggle.jsx';

const HeaderBar = ({ header }) => (
  <header className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12 sm:mb-16 md:mb-20 animate-fade-in'>
    <div className='flex items-center'>
      <Image
        src={
          header.avatar.includes('aliyuncs.com') && !header.avatar.includes('x-oss-process')
            ? `${header.avatar}?x-oss-process=image/resize,w_112`
            : header.avatar
        }
        alt={header.name}
        width={56}
        height={56}
        className='w-12 h-12 sm:w-14 sm:h-14 rounded-full mr-3 sm:mr-4 shadow-sm object-cover'
        priority
      />
      <span className='font-medium text-gray-900 dark:text-white text-lg tracking-tight'>
        {header.name}
      </span>
    </div>
    <div className='flex flex-wrap justify-center items-center gap-y-4 gap-x-4 sm:gap-8'>
      <PrimaryNav />
      <div className='flex items-center gap-2'>
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
    </div>
  </header>
);

HeaderBar.propTypes = {
  header: PropTypes.shape({
    avatar: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default React.memo(HeaderBar);
