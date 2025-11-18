import React from 'react';
import { NAV_LINKS } from '../lib/content.js';

const PrimaryNav = () => {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  const isActive = (href) => {
    if (!currentPath) return false;
    if (href === 'index.html') {
      return currentPath === '/' || currentPath.endsWith('/index.html');
    }
    return currentPath.endsWith(`/${href}`);
  };

  return (
    <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-600">
      {NAV_LINKS.map((link, index) => (
        <React.Fragment key={link.href}>
          {index > 0 && <span className="text-gray-300">/</span>}
          <a
            href={link.href}
            className={`transition-colors ${isActive(link.href) ? 'text-gray-900' : 'hover:text-gray-900'}`}
          >
            {link.label}
          </a>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default PrimaryNav;
