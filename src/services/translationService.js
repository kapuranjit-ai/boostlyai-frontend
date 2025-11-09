// src/services/translationService.js
class TranslationService {
  constructor() {
    this.cache = new Map();
    this.translationDictionary = this.createTranslationDictionary();
  }

  createTranslationDictionary() {
    return {
      // Content types
      'tip': {
        hindi: 'टिप', tamil: 'குறிப்பு', telugu: 'టిప్', kannada: 'ಟಿಪ್',
        marathi: 'टिप', gujarati: 'ટીપ', bengali: 'টিপ', punjabi: 'ਟਿਪ',
        malayalam: 'തന്ത്രം', odia: 'ଟିପ୍', urdu: 'ٹپ'
      },
      'fact': {
        hindi: 'तथ्य', tamil: 'உண்மை', telugu: 'వాస్తవం', kannada: 'ವಾಸ್ತವ',
        marathi: 'तथ्य', gujarati: 'હકીકત', bengali: 'সত্য', punjabi: 'ਤੱਥ',
        malayalam: 'വസ്തുത', odia: 'ତଥ୍ୟ', urdu: 'حقیقت'
      },
      'question': {
        hindi: 'प्रश्न', tamil: 'கேள்வி', telugu: 'ప్రశ్న', kannada: 'ಪ್ರಶ್ನೆ',
        marathi: 'प्रश्न', gujarati: 'પ્રશ્ન', bengali: 'প্রশ্ন', punjabi: 'ਸਵਾਲ',
        malayalam: 'ചോദ്യം', odia: 'ପ୍ରଶ୍ନ', urdu: 'سوال'
      },
      
      // Common phrases
      'Learn more': {
        hindi: 'अधिक जानें', tamil: 'மேலும் அறிக', telugu: 'మరింత తెలుసుకోండి',
        kannada: 'ಹೆಚ್ಚಿನ ತಿಳುವಳಿಕೆ', marathi: 'अधिक जाणून घ्या', gujarati: 'વધુ જાણો',
        bengali: 'আরও জানুন', punjabi: 'ਹੋਰ ਜਾਣੋ', malayalam: 'കൂടുതൽ അറിയുക',
        odia: 'ଅଧିକ ଜାଣନ୍ତୁ', urdu: 'مزید جانیں'
      },
      'Contact us': {
        hindi: 'हमसे संपर्क करें', tamil: 'எங்களை தொடர்பு கொள்ளவும்',
        telugu: 'మమ్మల్ని సంప్రదించండి', kannada: 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ',
        marathi: 'आमच्याशी संपर्क साधा', gujarati: 'અમારો સંપર્ક કરો',
        bengali: 'আমাদের সাথে যোগাযোগ করুন', punjabi: 'ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ',
        malayalam: 'ഞങ്ങളെ ബന്ധപ്പെടുക', odia: 'ଆମ ସହିତ ଯୋଗାଯୋଗ କରନ୍ତୁ',
        urdu: 'ہم سے رابطہ کریں'
      },
      'Get started': {
        hindi: 'शुरू करें', tamil: 'தொடங்கவும்', telugu: 'ప్రారంభించండి',
        kannada: 'ಪ್ರಾರಂಭಿಸಿ', marathi: 'सुरू करा', gujarati: 'શરૂ કરો',
        bengali: 'শুরু করুন', punjabi: 'ਸ਼ੁਰੂ ਕਰੋ', malayalam: 'ആരംഭിക്കുക',
        odia: 'ଆରମ୍ଭ କରନ୍ତୁ', urdu: 'شروع کریں'
      }
    };
  }

  // Main translation function
  async translateText(text, targetLanguage) {
    if (targetLanguage === 'english') {
      return text;
    }

    // Check cache first
    const cacheKey = `${text}-${targetLanguage}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Try dictionary-based translation first
      let translatedText = this.dictionaryTranslate(text, targetLanguage);
      
      if (!translatedText) {
        // If no dictionary match, use API-based translation
        translatedText = await this.apiTranslate(text, targetLanguage);
      }

      // Cache the result
      this.cache.set(cacheKey, translatedText);
      return translatedText;
    } catch (error) {
      console.warn('Translation failed, returning original:', error);
      return text;
    }
  }

  // Dictionary-based translation for common phrases
  dictionaryTranslate(text, targetLanguage) {
    const cleanText = text.trim();
    
    // Exact match
    if (this.translationDictionary[cleanText] && 
        this.translationDictionary[cleanText][targetLanguage]) {
      return this.translationDictionary[cleanText][targetLanguage];
    }

    // Partial match (replace phrases in text)
    let translatedText = text;
    for (const [phrase, translations] of Object.entries(this.translationDictionary)) {
      if (translations[targetLanguage] && text.includes(phrase)) {
        translatedText = translatedText.replace(
          new RegExp(phrase, 'gi'), 
          translations[targetLanguage]
        );
      }
    }

    return translatedText !== text ? translatedText : null;
  }

  // API-based translation (using free service)
  async apiTranslate(text, targetLanguage) {
    try {
      // Using MyMemory Translation API (free)
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${this.getLanguageCode(targetLanguage)}`
      );
      
      const data = await response.json();
      
      if (data.responseStatus === 200) {
        return data.responseData.translatedText;
      } else {
        throw new Error('Translation API error');
      }
    } catch (error) {
      console.warn('API translation failed:', error);
      // Fallback to simple indicator
      return `${text} [${targetLanguage.toUpperCase()}]`;
    }
  }

  getLanguageCode(language) {
    const languageMap = {
      'hindi': 'hi',
      'tamil': 'ta',
      'telugu': 'te',
      'kannada': 'kn',
      'marathi': 'mr',
      'gujarati': 'gu',
      'bengali': 'bn',
      'punjabi': 'pa',
      'malayalam': 'ml',
      'odia': 'or',
      'urdu': 'ur'
    };
    return languageMap[language] || language;
  }

  // Translate entire content object
  async translateContent(content, targetLanguage) {
    if (targetLanguage === 'english' || !content) {
      return content;
    }

    if (Array.isArray(content)) {
      const translatedArray = [];
      for (const item of content) {
        const translatedItem = await this.translateObject(item, targetLanguage);
        translatedArray.push(translatedItem);
      }
      return translatedArray;
    } else {
      return await this.translateObject(content, targetLanguage);
    }
  }

  async translateObject(obj, targetLanguage) {
    if (!obj || typeof obj !== 'object') return obj;

    const translated = {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string' && this.shouldTranslate(value)) {
        translated[key] = await this.translateText(value, targetLanguage);
      } else if (typeof value === 'object' && value !== null) {
        translated[key] = await this.translateContent(value, targetLanguage);
      } else {
        translated[key] = value;
      }
    }
    
    return translated;
  }

  shouldTranslate(text) {
    // Don't translate URLs, emails, codes, or very short text
    if (!text || text.length < 2) return false;
    if (text.startsWith('http')) return false;
    if (text.includes('@') && text.includes('.')) return false;
    if (/^[A-Z0-9_#]+$/.test(text)) return false; // HASHTAGS, CODES
    
    return true;
  }

  clearCache() {
    this.cache.clear();
  }
}

// Create and export singleton instance
const translationService = new TranslationService();
export default translationService;