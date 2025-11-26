import React from 'react';
import PropTypes from 'prop-types';

/**
 * 解析内容链接 - 支持内部和外部链接
 * @param {string} href - 原始链接
 * @returns {string} - 处理后的链接
 */
const resolveContentHref = (href) => {
  if (!href) return '#';
  // 外部链接直接返回
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return href;
  }
  // 内部链接确保以 / 开头
  return href.startsWith('/') ? href : `/${href}`;
};

/**
 * WebsiteItem (Astro 版本)
 * 网站卡片组件，显示网站标题、描述和封面图
 * 悬停时显示描述信息
 * 
 * 使用标准 <img> 替代 next/image，设置 sizes 保持响应式
 */
const WebsiteItem = ({ item, priority = false }) => (
  <a
    href={resolveContentHref(item.url)}
    target='_blank'
    rel='noopener noreferrer'
    aria-label={`访问 ${item.title}: ${item.description}`}
    className='relative block overflow-hidden rounded-lg shadow-md card-hover website-item focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white'
  >
    <div className='relative w-full h-64'>
      {/* 使用标准 img 标签替代 next/image */}
      <img
        src={item.image}
        alt={item.title}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchpriority={priority ? 'high' : 'auto'}
        className='absolute inset-0 w-full h-full object-cover'
        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
      />
    </div>
    <div className='absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/60 dark:via-black/40 card-overlay transition-all duration-300 flex flex-col p-6'>
      <div>
        <h3 className='text-white text-2xl font-bold mb-2 drop-shadow-md'>{item.title}</h3>
        <p className='text-white text-sm opacity-0 transition-opacity duration-300 website-description-text transform translate-y-2 transition-transform duration-300'>
          {item.description}
        </p>
      </div>
    </div>
  </a>
);

WebsiteItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  priority: PropTypes.bool,
};

export default React.memo(WebsiteItem);
