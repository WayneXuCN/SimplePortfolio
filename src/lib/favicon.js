export const applyFavicon = (faviconConfig = {}) => {
  if (typeof document === 'undefined') return;

  const existingLinks = document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]');
  existingLinks.forEach((link) => link.remove());

  const head = document.head;

  if (faviconConfig.ico) {
    const icoLink = document.createElement('link');
    icoLink.rel = 'icon';
    icoLink.type = 'image/x-icon';
    icoLink.href = faviconConfig.ico;
    head.appendChild(icoLink);
  }

  if (faviconConfig.appleTouchIcon) {
    const appleLink = document.createElement('link');
    appleLink.rel = 'apple-touch-icon';
    appleLink.sizes = '180x180';
    appleLink.href = faviconConfig.appleTouchIcon;
    head.appendChild(appleLink);
  }
};
