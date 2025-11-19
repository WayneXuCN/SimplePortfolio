import React from 'react';
import HeaderBar from './HeaderBar.jsx';
import WebsiteItem from './WebsiteItem.jsx';
import FeaturedPostItem from './FeaturedPostItem.jsx';
import SocialLink from './SocialLink.jsx';
import Hero from './Hero.jsx';
import About from './About.jsx';
import Contact from './Contact.jsx';
import { applyFavicon } from '../lib/favicon.js';
import { loadSiteContent } from '../lib/content.js';

const LoadingState = () => (
  <div className="flex justify-center items-center h-screen text-gray-600">
    内容加载中...
  </div>
);

const Home = ({ content }) => {
  const { header, hero, websites, featuredPosts, footer } = content;

  return (
    <div className="max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16 animate-fade-in">
      <HeaderBar header={header} />

      <Hero
        subtitle={hero.subtitle}
        title={hero.title}
        description={hero.description}
      />

      <section className="mb-12 sm:mb-16 md:mb-20">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 display-font">
          {websites.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {websites.items.map((item) => (
            <WebsiteItem key={item.id || item.title} item={item} />
          ))}
        </div>
      </section>

      <section className="mb-12 sm:mb-16 md:mb-20">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 display-font">
          {featuredPosts.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {featuredPosts.items.map((item) => (
            <FeaturedPostItem key={item.id || item.title} item={item} />
          ))}
        </div>
        <div className="flex justify-end mt-8 sm:mt-10">
          <a
            href={featuredPosts.seeAllUrl}
            className="text-pink-500 font-medium flex items-center hover:text-pink-600 transition-colors text-base sm:text-lg"
          >
            {featuredPosts.seeAllText}{' '}
            <i className="fas fa-arrow-right ml-2"></i>
          </a>
        </div>
      </section>

      <footer className="pt-12 sm:pt-16 pb-6 sm:pb-8 border-t border-gray-200">
        <div className="flex justify-between items-center flex-col md:flex-row gap-6 md:gap-0">
          <p className="text-gray-600 text-base sm:text-lg text-center md:text-left">
            {footer.copyright}
          </p>
          <div className="flex space-x-4 sm:space-x-6">
            {footer.socialLinks.map((link) => (
              <SocialLink key={link.url} link={link} />
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

const App = () => {
  const [content, setContent] = React.useState(null);
  const [currentPath, setCurrentPath] = React.useState(
    typeof window !== 'undefined' ? window.location.pathname : ''
  );

  React.useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      const safeContent = await loadSiteContent();
      if (!isMounted) return;

      applyFavicon(safeContent.site?.favicon);
      setContent(safeContent);
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!content) {
    return <LoadingState />;
  }

  if (currentPath.endsWith('/about.html')) {
    return <About content={content} />;
  }
  if (currentPath.endsWith('/contact.html')) {
    return <Contact content={content} />;
  }

  return <Home content={content} />;
};

export default App;
