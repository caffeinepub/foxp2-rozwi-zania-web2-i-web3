// Enhanced translation service for Web3 card content with better context awareness

interface TranslationMap {
  [key: string]: {
    en: string;
    de: string;
  };
}

// Enhanced translation mappings with more context-aware translations
const commonTranslations: TranslationMap = {
  // DeFi related terms
  'protokół': { en: 'protocol', de: 'Protokoll' },
  'zdecentralizowane': { en: 'decentralized', de: 'dezentral' },
  'zdecentralizowany': { en: 'decentralized', de: 'dezentral' },
  'zdecentralizowana': { en: 'decentralized', de: 'dezentral' },
  'finanse': { en: 'finance', de: 'Finanzen' },
  'finansów': { en: 'finance', de: 'Finanzen' },
  'finansowe': { en: 'financial', de: 'finanziell' },
  'staking': { en: 'staking', de: 'Staking' },
  'farming': { en: 'farming', de: 'Farming' },
  'yield': { en: 'yield', de: 'Ertrag' },
  'możliwość': { en: 'capability', de: 'Möglichkeit' },
  'możliwościami': { en: 'capabilities', de: 'Möglichkeiten' },
  'możliwością': { en: 'capability', de: 'Möglichkeit' },
  'funkcje': { en: 'features', de: 'Funktionen' },
  'funkcjami': { en: 'features', de: 'Funktionen' },
  
  // NFT and marketplace related
  'marketplace': { en: 'marketplace', de: 'Marktplatz' },
  'platforma': { en: 'platform', de: 'Plattform' },
  'platformy': { en: 'platform', de: 'Plattform' },
  'handlu': { en: 'trading', de: 'Handel' },
  'handel': { en: 'trading', de: 'Handel' },
  'tokenami': { en: 'tokens', de: 'Token' },
  'tokeny': { en: 'tokens', de: 'Token' },
  'token': { en: 'token', de: 'Token' },
  'niskimi': { en: 'low', de: 'niedrig' },
  'niskie': { en: 'low', de: 'niedrig' },
  'opłatami': { en: 'fees', de: 'Gebühren' },
  'opłaty': { en: 'fees', de: 'Gebühren' },
  'transakcyjnymi': { en: 'transaction', de: 'Transaktions' },
  'transakcyjne': { en: 'transaction', de: 'Transaktions' },
  'transakcji': { en: 'transactions', de: 'Transaktionen' },
  
  // DAO and governance related
  'zarządzania': { en: 'governance', de: 'Verwaltung' },
  'zarządzanie': { en: 'governance', de: 'Verwaltung' },
  'organizacją': { en: 'organization', de: 'Organisation' },
  'organizacja': { en: 'organization', de: 'Organisation' },
  'autonomiczną': { en: 'autonomous', de: 'autonom' },
  'autonomiczna': { en: 'autonomous', de: 'autonom' },
  'system': { en: 'system', de: 'System' },
  'systemu': { en: 'system', de: 'System' },
  
  // Blockchain and Web3 terms
  'blockchain': { en: 'blockchain', de: 'Blockchain' },
  'smart': { en: 'smart', de: 'Smart' },
  'kontrakty': { en: 'contracts', de: 'Verträge' },
  'kontrakt': { en: 'contract', de: 'Vertrag' },
  'aplikacja': { en: 'application', de: 'Anwendung' },
  'aplikacje': { en: 'applications', de: 'Anwendungen' },
  'dapp': { en: 'dApp', de: 'dApp' },
  'web3': { en: 'Web3', de: 'Web3' },
  'kryptowaluty': { en: 'cryptocurrencies', de: 'Kryptowährungen' },
  'kryptowaluta': { en: 'cryptocurrency', de: 'Kryptowährung' },
  
  // Technology terms
  'technologia': { en: 'technology', de: 'Technologie' },
  'technologie': { en: 'technologies', de: 'Technologien' },
  'innowacyjny': { en: 'innovative', de: 'innovativ' },
  'innowacyjna': { en: 'innovative', de: 'innovativ' },
  'nowoczesny': { en: 'modern', de: 'modern' },
  'nowoczesna': { en: 'modern', de: 'modern' },
  'bezpieczny': { en: 'secure', de: 'sicher' },
  'bezpieczna': { en: 'secure', de: 'sicher' },
  'bezpieczeństwo': { en: 'security', de: 'Sicherheit' },
  
  // Action words and buttons
  'dowiedz się więcej': { en: 'learn more', de: 'mehr erfahren' },
  'więcej informacji': { en: 'more information', de: 'weitere Informationen' },
  'sprawdź': { en: 'check out', de: 'schauen Sie sich an' },
  'sprawdź szczegóły': { en: 'check details', de: 'Details prüfen' },
  'odwiedź': { en: 'visit', de: 'besuchen' },
  'odwiedź stronę': { en: 'visit website', de: 'Website besuchen' },
  'zobacz': { en: 'see', de: 'sehen' },
  'poznaj': { en: 'discover', de: 'entdecken' },
  'rozpocznij': { en: 'start', de: 'starten' },
  'dołącz': { en: 'join', de: 'beitreten' },
  'wypróbuj': { en: 'try', de: 'ausprobieren' },
  'testuj': { en: 'test', de: 'testen' },
  'korzystaj': { en: 'use', de: 'nutzen' },
  'inwestuj': { en: 'invest', de: 'investieren' },
  'handluj': { en: 'trade', de: 'handeln' },
  
  // Common adjectives and descriptors
  'szybki': { en: 'fast', de: 'schnell' },
  'szybka': { en: 'fast', de: 'schnell' },
  'wydajny': { en: 'efficient', de: 'effizient' },
  'wydajna': { en: 'efficient', de: 'effizient' },
  'prosty': { en: 'simple', de: 'einfach' },
  'prosta': { en: 'simple', de: 'einfach' },
  'łatwy': { en: 'easy', de: 'einfach' },
  'łatwa': { en: 'easy', de: 'einfach' },
  'zaawansowany': { en: 'advanced', de: 'fortgeschritten' },
  'zaawansowana': { en: 'advanced', de: 'fortgeschritten' },
  'profesjonalny': { en: 'professional', de: 'professionell' },
  'profesjonalna': { en: 'professional', de: 'professionell' },
};

// Context-aware phrase translations with better sentence structure
const phraseTranslations: { [key: string]: { en: string; de: string } } = {
  // DeFi phrases
  'protokół zdecentralizowanych finansów': {
    en: 'Decentralized finance protocol',
    de: 'Dezentrales Finanzprotokoll'
  },
  'protokół zdecentralizowanych finansów z możliwością stakingu': {
    en: 'Decentralized finance protocol with staking capabilities',
    de: 'Dezentrales Finanzprotokoll mit Staking-Funktionen'
  },
  'protokół zdecentralizowanych finansów z możliwością stakingu i yield farmingu': {
    en: 'Decentralized finance protocol with staking and yield farming capabilities',
    de: 'Dezentrales Finanzprotokoll mit Staking- und Yield-Farming-Funktionen'
  },
  'protokół defi z funkcjami stakingu': {
    en: 'DeFi protocol with staking features',
    de: 'DeFi-Protokoll mit Staking-Funktionen'
  },
  'zaawansowany protokół finansowy': {
    en: 'Advanced financial protocol',
    de: 'Fortgeschrittenes Finanzprotokoll'
  },
  
  // NFT marketplace phrases
  'platforma handlu tokenami nft': {
    en: 'NFT trading platform',
    de: 'NFT-Handelsplattform'
  },
  'platforma handlu tokenami nft z niskimi opłatami': {
    en: 'NFT trading platform with low fees',
    de: 'NFT-Handelsplattform mit niedrigen Gebühren'
  },
  'platforma handlu tokenami nft z niskimi opłatami transakcyjnymi': {
    en: 'NFT trading platform with low transaction fees',
    de: 'NFT-Handelsplattform mit niedrigen Transaktionsgebühren'
  },
  'marketplace dla tokenów nft': {
    en: 'NFT token marketplace',
    de: 'NFT-Token-Marktplatz'
  },
  'bezpieczna platforma nft': {
    en: 'Secure NFT platform',
    de: 'Sichere NFT-Plattform'
  },
  
  // DAO phrases
  'system zarządzania zdecentralizowaną organizacją': {
    en: 'Decentralized organization management system',
    de: 'Verwaltungssystem für dezentrale Organisationen'
  },
  'system zarządzania zdecentralizowaną organizacją autonomiczną': {
    en: 'Decentralized autonomous organization management system',
    de: 'Verwaltungssystem für dezentrale autonome Organisationen'
  },
  'platforma zarządzania dao': {
    en: 'DAO management platform',
    de: 'DAO-Verwaltungsplattform'
  },
  'narzędzia zarządzania społecznością': {
    en: 'Community management tools',
    de: 'Community-Management-Tools'
  },
  
  // Technology phrases
  'innowacyjna technologia blockchain': {
    en: 'Innovative blockchain technology',
    de: 'Innovative Blockchain-Technologie'
  },
  'nowoczesne rozwiązania web3': {
    en: 'Modern Web3 solutions',
    de: 'Moderne Web3-Lösungen'
  },
  'bezpieczne aplikacje zdecentralizowane': {
    en: 'Secure decentralized applications',
    de: 'Sichere dezentrale Anwendungen'
  },
  
  // Button text translations
  'dowiedz się więcej': {
    en: 'Learn More',
    de: 'Mehr erfahren'
  },
  'więcej informacji': {
    en: 'More Information',
    de: 'Weitere Informationen'
  },
  'sprawdź szczegóły': {
    en: 'Check Details',
    de: 'Details prüfen'
  },
  'odwiedź stronę': {
    en: 'Visit Website',
    de: 'Website besuchen'
  },
  'rozpocznij teraz': {
    en: 'Start Now',
    de: 'Jetzt starten'
  },
  'dołącz do nas': {
    en: 'Join Us',
    de: 'Mach mit'
  },
  'wypróbuj za darmo': {
    en: 'Try for Free',
    de: 'Kostenlos testen'
  },
  'zobacz demo': {
    en: 'View Demo',
    de: 'Demo ansehen'
  },
  'rozpocznij handel': {
    en: 'Start Trading',
    de: 'Trading starten'
  },
  'inwestuj teraz': {
    en: 'Invest Now',
    de: 'Jetzt investieren'
  }
};

// Enhanced translation with better context awareness and sentence structure
function enhancedTranslate(text: string, targetLang: 'en' | 'de'): string {
  if (!text) return text;
  
  const lowerText = text.toLowerCase().trim();
  
  // First, check for exact phrase matches (most specific)
  for (const [polish, translations] of Object.entries(phraseTranslations)) {
    if (lowerText === polish.toLowerCase()) {
      return translations[targetLang];
    }
  }
  
  // Check for partial phrase matches (contains key phrases)
  for (const [polish, translations] of Object.entries(phraseTranslations)) {
    if (lowerText.includes(polish.toLowerCase())) {
      // Replace the matched phrase within the text
      const regex = new RegExp(polish.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const translated = text.replace(regex, translations[targetLang]);
      if (translated !== text) {
        return translated;
      }
    }
  }
  
  // Fall back to word-by-word translation with better sentence handling
  return translateWordByWord(text, targetLang);
}

// Improved word-by-word translation with better sentence structure
function translateWordByWord(text: string, targetLang: 'en' | 'de'): string {
  if (!text) return text;
  
  // Split text into words while preserving punctuation and spacing
  const words = text.split(/(\s+|[.,!?;:])/);
  
  const translatedWords = words.map(word => {
    // Skip whitespace and punctuation
    if (/^\s+$/.test(word) || /^[.,!?;:]+$/.test(word)) {
      return word;
    }
    
    const lowerWord = word.toLowerCase().replace(/[.,!?;:]/g, '');
    
    // Check if word exists in translations
    if (commonTranslations[lowerWord]) {
      const translation = commonTranslations[lowerWord][targetLang];
      // Preserve original capitalization
      if (word[0] === word[0].toUpperCase()) {
        return translation.charAt(0).toUpperCase() + translation.slice(1) + word.replace(/^[^.,!?;:]*/, '').replace(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]*/, '');
      }
      return translation + word.replace(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]*/, '');
    }
    
    return word;
  });
  
  return translatedWords.join('');
}

export interface TranslatedWeb3Card {
  id: string;
  imagePath: string;
  title: string;
  description: string;
  buttonTitle: string;
  link: string;
  titleEn?: string;
  titleDe?: string;
  descriptionEn?: string;
  descriptionDe?: string;
  buttonTitleEn?: string;
  buttonTitleDe?: string;
}

export function translateWeb3Card(card: {
  id: string;
  imagePath: string;
  title: string;
  description: string;
  buttonTitle: string;
  link: string;
}): TranslatedWeb3Card {
  return {
    ...card,
    titleEn: enhancedTranslate(card.title, 'en'),
    titleDe: enhancedTranslate(card.title, 'de'),
    descriptionEn: enhancedTranslate(card.description, 'en'),
    descriptionDe: enhancedTranslate(card.description, 'de'),
    buttonTitleEn: enhancedTranslate(card.buttonTitle, 'en'),
    buttonTitleDe: enhancedTranslate(card.buttonTitle, 'de'),
  };
}

export function getTranslatedCardContent(
  card: TranslatedWeb3Card,
  language: 'pl' | 'en' | 'de'
): {
  title: string;
  description: string;
  buttonTitle: string;
} {
  switch (language) {
    case 'en':
      return {
        title: card.titleEn || card.title,
        description: card.descriptionEn || card.description,
        buttonTitle: card.buttonTitleEn || card.buttonTitle,
      };
    case 'de':
      return {
        title: card.titleDe || card.title,
        description: card.descriptionDe || card.description,
        buttonTitle: card.buttonTitleDe || card.buttonTitle,
      };
    default:
      return {
        title: card.title,
        description: card.description,
        buttonTitle: card.buttonTitle,
      };
  }
}

// Helper function to get translation quality indicator
export function getTranslationQuality(originalText: string, translatedText: string): 'high' | 'medium' | 'low' {
  if (!originalText || !translatedText || originalText === translatedText) {
    return 'low';
  }
  
  const lowerOriginal = originalText.toLowerCase();
  
  // Check if we have phrase-level translations
  for (const phrase of Object.keys(phraseTranslations)) {
    if (lowerOriginal.includes(phrase.toLowerCase())) {
      return 'high';
    }
  }
  
  // Check word coverage
  const words = lowerOriginal.split(/\s+/);
  const translatedWords = words.filter(word => {
    const cleanWord = word.replace(/[.,!?;:]/g, '');
    return commonTranslations[cleanWord];
  });
  
  const coverage = translatedWords.length / words.length;
  
  if (coverage > 0.7) return 'high';
  if (coverage > 0.4) return 'medium';
  return 'low';
}

