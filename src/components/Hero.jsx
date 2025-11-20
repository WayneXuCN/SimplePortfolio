import React from 'react';

const Hero = ({ subtitle, title, description }) => {
  return (
    <section className="mb-12 sm:mb-16 md:mb-20">
      <h1 className="text-red-500 dark:text-red-400 text-sm font-bold mb-4 sm:mb-6 tracking-[0.2em] uppercase">
        {subtitle}
      </h1>
      <h2
        className="text-6xl font-bold mb-8 sm:mb-10 leading-tight display-font tracking-tight rich-text"
        dangerouslySetInnerHTML={{ __html: title }}
        style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 700 }}
      ></h2>
      <p
        className="text-xl sm:text-2xl mb-6 sm:mb-8 text-gray-700 dark:text-gray-300 max-w-3xl leading-relaxed rich-text"
        dangerouslySetInnerHTML={{ __html: description }}
      ></p>
    </section>
  );
};

export default Hero;
