import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children, content }) => {
  const [language, setLanguage] = useState('zh');

  useEffect(() => {
    try {
      // Check localStorage first
      const savedLang = localStorage.getItem('language');
      if (savedLang) {
        setLanguage(savedLang);
        return;
      }

      // Detect browser language
      const browserLang = navigator.language || navigator.userLanguage;
      if (browserLang && browserLang.toLowerCase().startsWith('en')) {
        setLanguage('en');
      } else {
        setLanguage('zh');
      }
    } catch (e) {
      console.warn('Failed to access localStorage or navigator:', e);
      setLanguage('zh');
    }
  }, []);

  const currentContent = content ? content[language] : null;

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const newLang = prev === 'zh' ? 'en' : 'zh';
      try {
        localStorage.setItem('language', newLang);
      } catch (e) {
        console.warn('Failed to save language to localStorage:', e);
      }
      return newLang;
    });
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    content: currentContent,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
