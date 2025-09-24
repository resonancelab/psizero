import { NewsSource } from './types';

export const DEFAULT_NEWS_SOURCES: NewsSource[] = [
  {
    id: 'reuters-business',
    name: 'Reuters Business',
    url: 'https://www.reuters.com/business/',
    rssUrl: 'https://www.reutersagency.com/feed/?best-topics=business-finance&post_type=best',
    category: 'general_finance',
    reliability: 0.95,
    updateFrequency: 10,
    active: true
  },
  {
    id: 'nasdaq-news',
    name: 'Nasdaq News',
    url: 'https://www.nasdaq.com',
    rssUrl: 'https://www.nasdaq.com/feed/rssoutbound?category=Markets',
    category: 'stocks',
    reliability: 0.90,
    updateFrequency: 15,
    active: true
  },
  {
    id: 'crypto-news',
    name: 'Crypto News',
    url: 'https://cryptonews.com',
    rssUrl: 'https://cryptonews.com/news/feed/',
    category: 'cryptocurrency',
    reliability: 0.85,
    updateFrequency: 10,
    active: true
  },
  {
    id: 'financial-juice',
    name: 'Financial Juice',
    url: 'https://www.financialjuice.com',
    rssUrl: 'https://www.financialjuice.com/feed.ashx',
    category: 'general_finance',
    reliability: 0.88,
    updateFrequency: 5,
    active: true
  },
  {
    id: 'seeking-alpha',
    name: 'Seeking Alpha',
    url: 'https://seekingalpha.com',
    rssUrl: 'https://seekingalpha.com/feed.xml',
    category: 'market_analysis',
    reliability: 0.88,
    updateFrequency: 20,
    active: true
  },
  {
    id: 'benzinga',
    name: 'Benzinga',
    url: 'https://www.benzinga.com',
    rssUrl: 'https://www.benzinga.com/feed',
    category: 'stocks',
    reliability: 0.82,
    updateFrequency: 15,
    active: true
  },
  {
    id: 'bloomberg-markets',
    name: 'Bloomberg Markets',
    url: 'https://www.bloomberg.com/markets',
    rssUrl: 'https://feeds.bloomberg.com/markets/news.rss',
    category: 'general_finance',
    reliability: 0.96,
    updateFrequency: 5,
    active: true
  },
  {
    id: 'cnbc-finance',
    name: 'CNBC Finance',
    url: 'https://www.cnbc.com/finance/',
    rssUrl: 'https://www.cnbc.com/id/100003114/device/rss/rss.html',
    category: 'general_finance',
    reliability: 0.89,
    updateFrequency: 10,
    active: true
  },
  {
    id: 'financial-times',
    name: 'Financial Times',
    url: 'https://www.ft.com',
    rssUrl: 'https://www.ft.com/rss/home',
    category: 'general_finance',
    reliability: 0.94,
    updateFrequency: 15,
    active: true
  },
  {
    id: 'investing-com',
    name: 'Investing.com',
    url: 'https://www.investing.com',
    rssUrl: 'https://www.investing.com/rss/news.rss',
    category: 'general_finance',
    reliability: 0.83,
    updateFrequency: 10,
    active: true
  }
];

export const CRYPTO_FOCUSED_SOURCES: NewsSource[] = [
  {
    id: 'cointelegraph',
    name: 'Cointelegraph',
    url: 'https://cointelegraph.com',
    rssUrl: 'https://cointelegraph.com/rss',
    category: 'cryptocurrency',
    reliability: 0.86,
    updateFrequency: 10,
    active: false // Temporarily disabled due to RSS issues
  },
  {
    id: 'coinbase-blog',
    name: 'Coinbase Blog',
    url: 'https://blog.coinbase.com',
    rssUrl: 'https://blog.coinbase.com/feed',
    category: 'cryptocurrency',
    reliability: 0.88,
    updateFrequency: 30,
    active: false // Temporarily disabled due to RSS access issues
  },
  {
    id: 'decrypt',
    name: 'Decrypt',
    url: 'https://decrypt.co',
    rssUrl: 'https://decrypt.co/feed',
    category: 'cryptocurrency',
    reliability: 0.84,
    updateFrequency: 15,
    active: true
  }
];

export const ECONOMIC_SOURCES: NewsSource[] = [
  {
    id: 'fed-news',
    name: 'Federal Reserve News',
    url: 'https://www.federalreserve.gov',
    rssUrl: 'https://www.federalreserve.gov/feeds/press_all.xml',
    category: 'economic_indicators',
    reliability: 0.98,
    updateFrequency: 60,
    active: true
  },
  {
    id: 'treasury-gov',
    name: 'US Treasury',
    url: 'https://home.treasury.gov',
    rssUrl: 'https://home.treasury.gov/rss/news',
    category: 'economic_indicators',
    reliability: 0.97,
    updateFrequency: 120,
    active: true
  }
];

// Combine all sources for comprehensive coverage
export const ALL_NEWS_SOURCES = [
  ...DEFAULT_NEWS_SOURCES,
  ...CRYPTO_FOCUSED_SOURCES,
  ...ECONOMIC_SOURCES
];

// Helper functions for source management
export function getSourcesByCategory(category: string): NewsSource[] {
  return ALL_NEWS_SOURCES.filter(source => source.category === category && source.active);
}

export function getActiveSources(): NewsSource[] {
  return ALL_NEWS_SOURCES.filter(source => source.active);
}

export function getHighReliabilitySources(threshold: number = 0.9): NewsSource[] {
  return ALL_NEWS_SOURCES.filter(source => source.reliability >= threshold && source.active);
}

export function getSourceById(id: string): NewsSource | undefined {
  return ALL_NEWS_SOURCES.find(source => source.id === id);
}