'use client';

import React, { useMemo } from 'react';
import HeaderBar from '../ui/HeaderBar.jsx';
import SocialLink from '../ui/SocialLink.jsx';
import IcpInfo from '../ui/IcpInfo.jsx';
import { useLanguage } from '../../lib/LanguageContext.jsx';

const Layout = ({ children }) => {
  const { content } = useLanguage();

  if (!content?.header || !content?.footer) {
    return null;
  }

  const { header, footer } = content;
  const socialLinks = Array.isArray(footer.socialLinks) ? footer.socialLinks : [];

  // 动态生成版权信息
  const copyrightText = useMemo(() => {
    if (!footer.copyright) return '';

    const currentYear = new Date().getFullYear();
    const startYear = 2024;

    // 替换模板中的占位符
    return footer.copyright
      .replace('{startYear}', startYear.toString())
      .replace('{currentYear}', currentYear.toString());
  }, [footer.copyright]);

  return (
    <div className='max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16 animate-fade-in'>
      <HeaderBar header={header} />

      <main>{children}</main>

      <footer className='pt-8 sm:pt-12 pb-4 sm:pb-6 border-t border-gray-200 dark:border-gray-800'>
        <div className='flex flex-col gap-4'>
          {/* 主要内容行：版权信息和社交链接 */}
          <div className='flex justify-between items-center flex-col md:flex-row gap-4 md:gap-0'>
            <div className='flex flex-col items-center md:items-start gap-2'>
              <p className='text-gray-600 dark:text-gray-400 text-sm text-center md:text-left'>
                {copyrightText}
              </p>
              {/* 备案信息 */}
              <IcpInfo footer={footer} />
            </div>
            <div className='flex space-x-4 sm:space-x-6'>
              {socialLinks.map(link => (
                <SocialLink key={link.url} link={link} />
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
