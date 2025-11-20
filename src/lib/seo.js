export const updateMetaTags = (siteConfig, lang) => {
  if (!siteConfig) return;

  // Update title
  if (siteConfig.title) {
    document.title = siteConfig.title;
  }

  // Update html lang attribute
  if (lang) {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  }

  // Helper to update or create meta tag
  const updateMeta = (name, content) => {
    if (!content) return;
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = name;
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  // Update standard meta tags
  updateMeta('description', siteConfig.description);
  updateMeta('keywords', siteConfig.keywords);
  updateMeta('author', siteConfig.author);

  // Update Open Graph tags for social sharing
  const updateOgMeta = (property, content) => {
    if (!content) return;
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  updateOgMeta('og:title', siteConfig.title);
  updateOgMeta('og:description', siteConfig.description);
  updateOgMeta('og:locale', lang === 'zh' ? 'zh_CN' : 'en_US');

  // If there's an image for sharing (e.g. avatar or a specific share image)
  // We can use the avatar as a fallback for now if no specific share image is defined
  if (siteConfig.favicon?.appleTouchIcon) {
    updateOgMeta('og:image', siteConfig.favicon.appleTouchIcon);
  }
};
