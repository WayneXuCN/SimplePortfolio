import React from 'react';

const SocialLink = ({ link }) => (
  <a
    href={link.url}
    className="text-gray-600 hover:text-gray-900 transition-colors social-icon text-xl"
    title={link.title || ''}
    target="_blank"
    rel="noopener noreferrer"
  >
    {link.imageUrl ? (
      <img src={link.imageUrl} alt={link.title || 'social-icon'} className="w-full h-full object-contain" loading="lazy" />
    ) : (
      <i className={link.icon}></i>
    )}
  </a>
);

export default SocialLink;
