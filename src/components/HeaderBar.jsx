import React from 'react';
import PrimaryNav from './PrimaryNav.jsx';

const HeaderBar = ({ header }) => (
  <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12 sm:mb-16 md:mb-20">
    <div className="flex items-center">
      <img
        src={header.avatar}
        alt={header.name}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full mr-3 sm:mr-4"
        loading="lazy"
      />
      <span className="font-medium text-gray-800 text-lg">{header.name}</span>
    </div>
    <PrimaryNav />
  </header>
);

export default HeaderBar;
