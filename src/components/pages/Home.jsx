import React, { useMemo } from 'react';
import Link from 'next/link';
import Hero from '../ui/Hero.jsx';
import WebsiteItem from '../ui/WebsiteItem.jsx';
import FeaturedPostItem from '../ui/FeaturedPostItem.jsx';
import { resolveContentHref } from '../../lib/urlUtils.js';
import { getRSSPostsClient } from '../../lib/getRSSPosts.js';

const Home = ({ content, language }) => {
  const { hero, websites, featuredPosts } = content;

  // 直接同步获取 RSS 数据，避免客户端渲染闪烁
  const rssPosts = getRSSPostsClient(language);

  // 使用 useMemo 优化数据合并逻辑
  const displayPosts = useMemo(() => {
    // 合并 RSS 和手动条目
    const manualItems = featuredPosts.items || [];
    let posts = [];

    // 检查是否是默认的占位数据
    const isDefaultRSS = rssPosts.length === 1 && rssPosts[0].id === 'default-1';

    if (rssPosts.length > 0 && !isDefaultRSS) {
      // 如果有有效的 RSS 数据，优先显示 RSS
      posts = [...rssPosts];

      // 追加手动条目（去重）
      const rssUrls = new Set(rssPosts.map(p => p.url));
      manualItems.forEach(item => {
        if (!rssUrls.has(item.url)) {
          posts.push(item);
        }
      });
    } else {
      // 如果没有 RSS 数据或只有占位符，显示手动条目
      // 如果手动条目也没有，才显示占位符（如果有的话）
      if (manualItems.length > 0) {
        posts = manualItems;
      } else {
        posts = rssPosts; // 显示占位符
      }
    }
    return posts;
  }, [featuredPosts.items, rssPosts]);

  return (
    <>
      <Hero subtitle={hero.subtitle} title={hero.title} description={hero.description} />

      <section className='mb-12 sm:mb-16 md:mb-20'>
        <h2 className='text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 display-font'>
          {websites.title}
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8'>
          {websites.items.map((item, index) => (
            <WebsiteItem key={item.id || item.title} item={item} priority={index === 0} />
          ))}
        </div>
      </section>

      <section className='mb-12 sm:mb-16 md:mb-20'>
        <h2 className='text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 display-font'>
          {featuredPosts.title}
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8'>
          {displayPosts.map(item => (
            <FeaturedPostItem key={item.id || item.title} item={item} language={language} />
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
