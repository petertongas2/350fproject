import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const languageNames: Record<string, string> = {
  en: 'English',
  es: 'Español',
  zh: '中文'
};

export default function LanguageSelector() {
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();

  return (
    <select
      value={currentLanguage}
      onChange={(e) => changeLanguage(e.target.value)}
      className="bg-white border border-gray-300 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {availableLanguages.map((lang) => (
        <option key={lang} value={lang}>
          {languageNames[lang]}
        </option>
      ))}
    </select>
  );
}