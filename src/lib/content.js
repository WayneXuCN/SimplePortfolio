export const CONTENT_URL = 'content.json';

export const NAV_LINKS = [
  { label: '首页', href: 'index.html' },
  { label: '关于', href: 'about.html' },
  { label: '联系', href: 'contact.html' },
];

export const DEFAULT_CONTENT = {
  site: {
    title: 'Wenjie Xu - Personal Website',
    author: '徐文杰',
    favicon: {
      ico: 'favicon.ico',
      appleTouchIcon: 'apple-touch-icon.png',
    },
  },
  header: {
    avatar: 'https://picsum.photos/seed/avatar123/50/50.jpg',
    name: '徐文杰',
  },
  hero: {
    subtitle: 'WENJIE XU',
    title: '保持好奇 也保持自在',
    description:
      "Collaborating with diverse people is something I truly enjoy.<br />If you want to <a href=\"mailto:wenjie.xu.cn@outlook.com\" class=\"underline\">contact me</a>, I'll be happy to connect!",
  },
  websites: {
    title: 'Websites',
    items: [],
  },
  featuredPosts: {
    title: 'Featured Posts',
    items: [],
    seeAllText: 'See All Posts',
    seeAllUrl: '#',
  },
  footer: {
    copyright: '© 2025 All Rights Reserved.',
    socialLinks: [],
  },
  about: {
    hero: {
      subtitle: 'STORY',
      title: 'About Me',
      description: 'My Story',
    },
    timeline: {
      subtitle: 'TIMELINE',
      title: 'Timeline',
      period: '2015 - Now',
      items: [],
    },
    values: {
      subtitle: 'VALUES',
      title: 'Values',
      items: [],
      product: {
        subtitle: 'Product',
        title: 'Product Title',
        description: 'Product Description',
        linkText: 'Link',
        linkUrl: '#',
      },
    },
    philosophy: {
      subtitle: 'PHILOSOPHY',
      title: 'Philosophy',
      description: 'Philosophy Description',
      ctaText: 'Contact',
      ctaUrl: 'contact.html',
    },
  },
  contact: {
    hero: {
      subtitle: 'CONTACT',
      title: 'Contact Me',
      description: 'Get in touch',
    },
    cards: {
      email: {
        subtitle: 'EMAIL',
        address: 'email@example.com',
        note: 'Note',
      },
      social: {
        subtitle: 'SOCIAL',
        items: [],
      },
    },
    form: {
      subtitle: 'FORM',
      title: 'Form Title',
      note: 'Note',
    },
    services: {
      items: [],
    },
  },
};

const deepClone = (value) => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
};

const mergeSection = (section = {}, fallback = {}) => ({
  ...fallback,
  ...section,
});

const mergeListSection = (section = {}, fallback = {}) => ({
  ...mergeSection(section, fallback),
  items: Array.isArray(section?.items) ? section.items : fallback.items,
});

export const mergeContent = (data = {}) => {
  const site = mergeSection(data.site, DEFAULT_CONTENT.site);
  const header = mergeSection(data.header, DEFAULT_CONTENT.header);
  const hero = mergeSection(data.hero, DEFAULT_CONTENT.hero);
  const websites = mergeListSection(data.websites, DEFAULT_CONTENT.websites);
  const featuredPosts = {
    ...mergeListSection(data.featuredPosts, DEFAULT_CONTENT.featuredPosts),
    seeAllText:
      data.featuredPosts?.seeAllText ??
      DEFAULT_CONTENT.featuredPosts.seeAllText,
    seeAllUrl:
      data.featuredPosts?.seeAllUrl ?? DEFAULT_CONTENT.featuredPosts.seeAllUrl,
  };
  const footer = {
    ...mergeSection(data.footer, DEFAULT_CONTENT.footer),
    socialLinks: Array.isArray(data.footer?.socialLinks)
      ? data.footer.socialLinks
      : DEFAULT_CONTENT.footer.socialLinks,
  };

  const about = {
    hero: mergeSection(data.about?.hero, DEFAULT_CONTENT.about.hero),
    timeline: mergeListSection(
      data.about?.timeline,
      DEFAULT_CONTENT.about.timeline
    ),
    values: {
      ...mergeListSection(data.about?.values, DEFAULT_CONTENT.about.values),
      product: mergeSection(
        data.about?.values?.product,
        DEFAULT_CONTENT.about.values.product
      ),
    },
    philosophy: mergeSection(
      data.about?.philosophy,
      DEFAULT_CONTENT.about.philosophy
    ),
  };

  const contact = {
    hero: mergeSection(data.contact?.hero, DEFAULT_CONTENT.contact.hero),
    cards: {
      email: mergeSection(
        data.contact?.cards?.email,
        DEFAULT_CONTENT.contact.cards.email
      ),
      social: mergeListSection(
        data.contact?.cards?.social,
        DEFAULT_CONTENT.contact.cards.social
      ),
    },
    form: mergeSection(data.contact?.form, DEFAULT_CONTENT.contact.form),
    services: mergeListSection(
      data.contact?.services,
      DEFAULT_CONTENT.contact.services
    ),
  };

  return {
    site,
    header,
    hero,
    websites,
    featuredPosts,
    footer,
    about,
    contact,
  };
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
