import React from 'react';
import PropTypes from 'prop-types';

// 定义特定卡片的样式映射
const POST_STYLES = {
  'about-MyWork': 'bg-yellow-500 bg-opacity-80',
  'markdown-syntax': 'bg-blue-900 bg-opacity-80',
};

/**
 * 解析内容链接 - 支持内部和外部链接
 * @param {string} href - 原始链接
 * @returns {string} - 处理后的链接
 */
const resolveContentHref = href => {
  if (!href) return '#';
  // 外部链接直接返回
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return href;
  }
  // 内部链接确保以 / 开头
  return href.startsWith('/') ? href : `/${href}`;
};

/**
 * FeaturedPostItem
 * - 默认显示：标题 + 第一分类（category）
 * - 悬停时显示：简介(description) 和 发布时间(pubDate)
 */
const FeaturedPostItem = ({ item, language = 'zh' }) => {
  const categories = item.categories || (item.category ? [item.category] : []);
  const pubDate = item.pubDate || item.updated || item.published || null;
  const isRSS = item.isRSS || false;

  // 获取特定样式，如果没有则为 null（使用默认黑色渐变）
  const customOverlayClass = POST_STYLES[item.id] || null;
  const isBlackOverlay = !customOverlayClass;

  // 格式化日期，使用传入的语言环境
  const formattedDate = React.useMemo(() => {
    if (!pubDate) return null;
    try {
      const locale = language === 'en' ? 'en-US' : 'zh-CN';
      return new Date(pubDate).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return pubDate;
    }
  }, [pubDate, language]);

  return (
    <a
      href={resolveContentHref(item.url)}
      target='_blank'
      rel='noopener noreferrer'
      aria-label={`阅读文章: ${item.title}`}
      className='relative block overflow-hidden rounded-lg shadow-md card-hover featured-post-item website-item focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white group'
    >
      <div className='relative w-full h-64'>
        {/* 使用标准 img 标签替代 next/image */}
        <img
          src={item.image}
          alt={item.title}
          loading='lazy'
          decoding='async'
          className='absolute inset-0 w-full h-full object-cover'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
        />
      </div>

      <div
        className={`absolute inset-0 ${
          isBlackOverlay
            ? 'bg-gradient-to-b from-black/80 via-black/20 to-black/90 dark:via-black/40'
            : customOverlayClass
        } card-overlay transition-all duration-300 flex flex-col justify-between p-6`}
      >
        <div>
          <h3 className='text-white text-xl font-bold mb-2 line-clamp-2 drop-shadow-md'>
            {item.title}
          </h3>
        </div>

        <div className='mt-auto'>
          <p className='text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 website-description-text transform translate-y-2 line-clamp-3 mb-4'>
            {item.description}
          </p>

          <div className='flex items-end justify-between gap-2'>
            <div className='flex flex-wrap gap-1.5'>
              {categories.map((cat, index) => (
                <span
                  key={index}
                  className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded ${
                    index === 0 ? 'bg-white/90 text-black' : 'bg-white/20 text-white'
                  }`}
                >
                  {cat}
                </span>
              ))}
            </div>

            <div className='flex flex-col items-end shrink-0'>
              {isRSS && <span className='text-[10px] text-white/60 mb-0.5'>RSS</span>}
              {formattedDate && <p className='text-white text-xs opacity-80'>{formattedDate}</p>}
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

FeaturedPostItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    description: PropTypes.string,
    categories: PropTypes.array,
    category: PropTypes.string,
    pubDate: PropTypes.string,
    isRSS: PropTypes.bool,
  }).isRequired,
  language: PropTypes.string,
};

export default React.memo(FeaturedPostItem);
