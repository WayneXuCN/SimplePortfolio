import React from 'react';
import { openInNewTab } from '../lib/navigation.js';

const WebsiteItem = ({ item }) => (
  <div
    className="relative overflow-hidden rounded-lg shadow-md card-hover portfolio-item website-item"
    onClick={() => openInNewTab(item.url)}
    role="button"
    tabIndex={0}
    onKeyDown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openInNewTab(item.url);
      }
    }}
  >
    <img src={item.image} alt={item.title} className="w-full h-64 object-cover" loading="lazy" />
    <div className="absolute inset-0 bg-black bg-opacity-40 card-overlay transition-all duration-300 flex flex-col p-6">
      <div>
        <h3 className="text-white text-2xl font-bold mb-2">{item.title}</h3>
        <p className="text-white text-sm opacity-0 transition-opacity duration-300 website-description-text transform translate-y-2 transition-transform duration-300">
          {item.description}
        </p>
      </div>
    </div>
  </div>
);

export default WebsiteItem;
