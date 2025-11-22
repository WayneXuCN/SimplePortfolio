import React from 'react';
import { Noto_Sans } from 'next/font/google';
import Script from 'next/script';
import { LanguageProvider } from '../lib/LanguageContext';
import { ThemeProvider } from '../lib/ThemeContext';
import UnderlineEffects from '../components/ui/UnderlineEffects';
import { locales, defaultLocale } from '../locales/config';
import './globals.css';

const notoSans = Noto_Sans({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sans',
});

// 获取默认语言的元数据
const getDefaultMetadata = () => {
  const siteData = locales[defaultLocale]?.data?.site || {};
  const favicon = siteData.favicon || {};

  return {
    title: siteData.title || 'Portfolio',
    description: siteData.description || 'Personal Portfolio Website',
    icons: {
      icon: favicon.ico || '/favicon.ico',
      apple: favicon.appleTouchIcon || '/apple-touch-icon.png',
    },
  };
};

export const metadata = getDefaultMetadata();

export default function RootLayout({ children }) {
  return (
    <html lang='zh-CN' className={notoSans.variable} suppressHydrationWarning>
      <head>
        <link
          rel='stylesheet'
          href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
        />
        <noscript>
          <link
            rel='stylesheet'
            href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
          />
        </noscript>
        <link rel='stylesheet' href='/assets/css/custom-icons.css' />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className='bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 font-sans'>
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy='afterInteractive'
            />
            <Script id='google-analytics' strategy='afterInteractive'>
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
        <LanguageProvider>
          <ThemeProvider>
            {children}
            <UnderlineEffects />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
