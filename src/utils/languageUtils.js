// src/utils/languageUtils.js
export const getLanguageName = (langCode) => {
  const languageMap = {
    'english': 'English',
    'hindi': 'Hindi',
    'tamil': 'Tamil',
    'telugu': 'Telugu',
    'kannada': 'Kannada',
    'marathi': 'Marathi',
    'gujarati': 'Gujarati',
    'bengali': 'Bengali',
    'punjabi': 'Punjabi',
    'malayalam': 'Malayalam',
    'odia': 'Odia',
    'urdu': 'Urdu'
  };
  return languageMap[langCode] || langCode;
};

export const getLanguageIcon = (langCode) => {
  const iconMap = {
    'english': '🇺🇸',
    'hindi': '🇮🇳',
    'tamil': '🇮🇳',
    'telugu': '🇮🇳',
    'kannada': '🇮🇳',
    'marathi': '🇮🇳',
    'gujarati': '🇮🇳',
    'bengali': '🇮🇳',
    'punjabi': '🇮🇳',
    'malayalam': '🇮🇳',
    'odia': '🇮🇳',
    'urdu': '🇮🇳'
  };
  return iconMap[langCode] || '🌐';
};

export const getNativeLanguageName = (langCode) => {
  const nativeMap = {
    'english': 'English',
    'hindi': 'हिन्दी',
    'tamil': 'தமிழ்',
    'telugu': 'తెలుగు',
    'kannada': 'ಕನ್ನಡ',
    'marathi': 'मराठी',
    'gujarati': 'ગુજરાતી',
    'bengali': 'বাংলা',
    'punjabi': 'ਪੰਜਾਬੀ',
    'malayalam': 'മലയാളം',
    'odia': 'ଓଡ଼ିଆ',
    'urdu': 'اردو'
  };
  return nativeMap[langCode] || langCode;
};