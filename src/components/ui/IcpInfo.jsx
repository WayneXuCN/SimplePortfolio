'use client';

import React from 'react';

const IcpInfo = ({ footer }) => {
  if (!footer) return null;

  const { icp, mps } = footer;

  return (
    <div className='flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs text-gray-500 dark:text-gray-400'>
      {/* ICP备案 */}
      {icp?.text && icp?.url && (
        <a
          href={icp.url}
          target='_blank'
          rel='noopener noreferrer'
          className='hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200'
        >
          {icp.text}
        </a>
      )}

      {/* 分隔符 */}
      {icp?.text && mps?.text && <span className='text-gray-400 select-none'>|</span>}

      {/* 公安备案 */}
      {mps?.text && mps?.url && (
        <a
          href={mps.url}
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200'
        >
          {mps?.logo && <img src={mps.logo} alt='公安备案' className='w-3 h-3 object-contain' />}
          <span>{mps.text}</span>
        </a>
      )}
    </div>
  );
};

export default IcpInfo;
