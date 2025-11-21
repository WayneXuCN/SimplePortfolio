import React from 'react';
import Link from 'next/link';
import Hero from '../ui/Hero.jsx';
import WebsiteItem from '../ui/WebsiteItem.jsx';
import FeaturedPostItem from '../ui/FeaturedPostItem.jsx';
import { resolveContentHref } from '../../lib/urlUtils.js';

const Home = ({ content }) => {
  const { hero, websites, featuredPosts } = content;

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
          {featuredPosts.items.map(item => (
            <FeaturedPostItem key={item.id || item.title} item={item} />
          ))}
        </div>
        <div className='flex justify-end mt-8 sm:mt-10'>
          <Link
            href={resolveContentHref(featuredPosts.seeAllUrl)}
            className='text-pink-500 font-medium flex items-center hover:text-pink-600 transition-colors text-base sm:text-lg'
          >
            {featuredPosts.seeAllText} <i className='fas fa-arrow-right ml-2'></i>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;
