/**
 * getRSSPosts.js
 * 静态导入本地生成的 RSS JSON 数据
 * 优化：使用静态导入替代动态导入，避免客户端渲染时的闪烁
 */

import rssData from '../data/rss-posts.json';

// 默认的RSS数据，当读取失败或数据为空时使用
const defaultRSSPosts = [
  {
    id: 'default-1',
    title: '暂无最新文章',
    description: 'RSS订阅源暂时无法访问，请稍后再试',
    url: '#',
    image: 'https://picsum.photos/seed/no-posts/600/350.jpg',
    pubDate: null,
    categories: [],
    overlayColor: 'bg-black',
    overlayOpacity: 'bg-opacity-70',
  },
];

/**
 * 获取 RSS 数据 (同步)
 * @param {string} lang - 语言代码 ('zh' | 'en')
 */
export function getRSSPostsClient(lang = 'zh') {
  try {
    // 兼容旧结构（数组）和新结构（对象按语言分类）
    let posts = [];
    if (Array.isArray(rssData)) {
      posts = rssData;
    } else if (rssData && typeof rssData === 'object') {
      posts = rssData[lang] || [];
    }

    if (!posts || posts.length === 0) {
      return defaultRSSPosts;
    }
    return posts;
  } catch (err) {
    console.warn('读取RSS数据失败:', err);
    return defaultRSSPosts;
  }
}
