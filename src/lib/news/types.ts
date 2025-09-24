export interface NewsItem {
  id: string;
  title: string;
  description: string;
  content?: string;
  url: string;
  source: string;
  category: NewsCategory;
  publishedAt: Date;
  sentiment?: SentimentAnalysis;
  symbols?: string[]; // Stock symbols mentioned
  keywords?: string[];
  imageUrl?: string;
}

export interface SentimentAnalysis {
  score: number; // -1 to 1 (negative to positive)
  magnitude: number; // 0 to 1 (strength of sentiment)
  classification: 'bearish' | 'neutral' | 'bullish';
  confidence: number; // 0 to 1
}

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  rssUrl: string;
  category: NewsCategory;
  reliability: number; // 0 to 1
  updateFrequency: number; // minutes
  lastFetched?: Date;
  active: boolean;
}

export type NewsCategory = 
  | 'general_finance'
  | 'cryptocurrency' 
  | 'stocks'
  | 'forex'
  | 'commodities'
  | 'economic_indicators'
  | 'earnings'
  | 'market_analysis';

export interface NewsFilter {
  sources?: string[];
  categories?: NewsCategory[];
  symbols?: string[];
  sentiment?: 'bearish' | 'neutral' | 'bullish';
  timeRange?: {
    start: Date;
    end: Date;
  };
  limit?: number;
}

export interface NewsAggregatorConfig {
  sources: NewsSource[];
  cacheTimeout: number; // minutes
  maxArticlesPerSource: number;
  sentimentAnalysis: boolean;
  symbolExtraction: boolean;
  retryAttempts: number;
  requestTimeout: number; // milliseconds
}

export interface RSSFeedItem {
  title: string;
  description: string;
  content?: string;
  link: string;
  pubDate: string;
  guid?: string;
  category?: string;
  author?: string;
  enclosure?: {
    url: string;
    type: string;
  };
}

export interface ParsedFeed {
  title: string;
  description: string;
  link: string;
  lastBuildDate?: string;
  items: RSSFeedItem[];
}