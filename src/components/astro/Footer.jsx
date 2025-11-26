import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * SocialLink - 社交链接图标
 */
const SocialLink = ({ link }) => (
  <a
    href={link.url}
    className='text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors social-icon text-xl'
    title={link.title || ''}
    aria-label={link.title || 'Social link'}
    target='_blank'
    rel='noopener noreferrer'
  >
    {link.imageUrl ? (
      <img
        src={link.imageUrl}
        alt={link.title || 'social-icon'}
        className='w-full h-full object-contain'
        loading='lazy'
        decoding='async'
      />
    ) : (
      <i className={link.icon} aria-hidden='true'></i>
    )}
  </a>
);

SocialLink.propTypes = {
  link: PropTypes.shape({
    url: PropTypes.string.isRequired,
    title: PropTypes.string,
    icon: PropTypes.string,
    imageUrl: PropTypes.string,
  }).isRequired,
};

/**
 * IcpInfo - 备案信息组件
 * 响应式设计：小屏幕垂直堆叠，中等及以上屏幕水平排列
 */
const IcpInfo = ({ footer }) => {
  if (!footer) return null;

  const { icp, mps } = footer;

  return (
    <div className='flex flex-col sm:flex-row items-center justify-center md:justify-start gap-1 sm:gap-2 text-xs text-gray-500 dark:text-gray-400'>
      {/* ICP备案 */}
      {icp?.text && icp?.url && (
        <a
          href={icp.url}
          target='_blank'
          rel='noopener noreferrer'
          className='hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 whitespace-nowrap'
        >
          {icp.text}
        </a>
      )}

      {/* 分隔符 - 仅在 sm 及以上屏幕显示 */}
      {icp?.text && mps?.text && (
        <span className='hidden sm:inline text-gray-400 select-none'>|</span>
      )}

      {/* 公安备案 */}
      {mps?.text && mps?.url && (
        <a
          href={mps.url}
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 whitespace-nowrap'
        >
          {mps?.logo && (
            <img
              src={mps.logo}
              alt='公安备案'
              className='w-3 h-3 object-contain flex-shrink-0'
              loading='lazy'
              decoding='async'
            />
          )}
          <span>{mps.text}</span>
        </a>
      )}
    </div>
  );
};

/**
 * Footer
 * 页脚组件，包含版权信息、备案信息、社交链接
 */
const Footer = ({ footer }) => {
  if (!footer) return null;

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
    <footer className='pt-8 sm:pt-12 pb-4 sm:pb-6 border-t border-gray-200 dark:border-gray-800 mt-12 sm:mt-16'>
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
  );
};

Footer.propTypes = {
  footer: PropTypes.shape({
    copyright: PropTypes.string,
    icp: PropTypes.object,
    mps: PropTypes.object,
    socialLinks: PropTypes.array,
  }),
};

export default Footer;
