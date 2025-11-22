import React from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { resolveContentHref } from '../../lib/urlUtils.js';

/**
 * FeaturedPostItem
 * - 默认显示：标题 + 第一分类（category）
 * - 悬停时显示：简介(description) 和 发布时间(pubDate)
 * 保持现有 overlay 的视觉风格，仅调整内容布局与过渡效果
 */
const FeaturedPostItem = ({ item, language = 'zh' }) => {
  const categories = item.categories || (item.category ? [item.category] : []);
  const pubDate = item.pubDate || item.updated || item.published || null;
  const isRSS = item.isRSS || false;

  // 格式化日期，使用传入的语言环境，避免 hydration mismatch
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
        <Image
          src={item.image}
          alt={item.title}
          fill
          className='object-cover'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
        />
      </div>

      <div
        className={`absolute inset-0 ${item.overlayColor} ${item.overlayOpacity} card-overlay transition-all duration-300 flex flex-col justify-between p-6`}
      >
        <div>
          <h3 className='text-white text-xl font-bold mb-2 line-clamp-2'>{item.title}</h3>
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
    overlayColor: PropTypes.string,
    overlayOpacity: PropTypes.string,
    isRSS: PropTypes.bool,
  }).isRequired,
  language: PropTypes.string,
};

export default React.memo(FeaturedPostItem);
