export const CONTENT_URL = 'content.json';

export const NAV_LINKS = [
  { label: '首页', href: 'index.html' },
  { label: '关于', href: 'about.html' },
  { label: '联系', href: 'contact.html' }
];

export const DEFAULT_CONTENT = {
  site: {
    title: 'Wenjie Xu - Personal Website',
    author: '徐文杰',
    favicon: {
      ico: 'favicon.ico',
      appleTouchIcon: 'apple-touch-icon.png'
    }
  },
  header: {
    avatar: 'https://picsum.photos/seed/avatar123/50/50.jpg',
    name: '徐文杰'
  },
  hero: {
    subtitle: 'WENJIE XU',
    title: '保持好奇 也保持自在',
    description:
      'Join us and witness every step as a one-person company grows from chaos to clarity — with <span class="underline">MDFriday</span> as the engine behind it.'
  },
  websites: {
    title: 'Websites',
    items: []
  },
  featuredPosts: {
    title: 'Featured Posts',
    items: [],
    seeAllText: 'See All Posts',
    seeAllUrl: '#'
  },
  footer: {
    copyright: '© 2025 All Rights Reserved.',
    socialLinks: []
  }
};

const deepClone = (value) => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
};

const mergeSection = (section = {}, fallback = {}) => ({
  ...fallback,
  ...section
});

const mergeListSection = (section = {}, fallback = {}) => ({
  ...mergeSection(section, fallback),
  items: Array.isArray(section?.items) ? section.items : fallback.items
});

export const mergeContent = (data = {}) => {
  const site = mergeSection(data.site, DEFAULT_CONTENT.site);
  const header = mergeSection(data.header, DEFAULT_CONTENT.header);
  const hero = mergeSection(data.hero, DEFAULT_CONTENT.hero);
  const websites = mergeListSection(data.websites, DEFAULT_CONTENT.websites);
  const featuredPosts = {
    ...mergeListSection(data.featuredPosts, DEFAULT_CONTENT.featuredPosts),
    seeAllText: data.featuredPosts?.seeAllText ?? DEFAULT_CONTENT.featuredPosts.seeAllText,
    seeAllUrl: data.featuredPosts?.seeAllUrl ?? DEFAULT_CONTENT.featuredPosts.seeAllUrl
  };
  const footer = {
    ...mergeSection(data.footer, DEFAULT_CONTENT.footer),
    socialLinks: Array.isArray(data.footer?.socialLinks)
      ? data.footer.socialLinks
      : DEFAULT_CONTENT.footer.socialLinks
  };

  return { site, header, hero, websites, featuredPosts, footer };
};

export const fetchSiteContent = async () => {
  try {
    const response = await fetch(CONTENT_URL, { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error(`请求失败：${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('加载内容时发生错误，已回退到内置副本：', error);
    return deepClone(DEFAULT_CONTENT);
  }
};

export const loadSiteContent = async () => {
  const remoteContent = await fetchSiteContent();
  return mergeContent(remoteContent);
};
