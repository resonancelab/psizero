// Main exports for the news aggregation system
export * from './types';
export * from './sources';
export * from './rss-parser';
export * from './sentiment-analyzer';
export * from './news-aggregator';

// Convenience re-exports
export { NewsAggregator } from './news-aggregator';
export { SentimentAnalyzer } from './sentiment-analyzer';
export { RSSParser } from './rss-parser';
export { 
  ALL_NEWS_SOURCES, 
  DEFAULT_NEWS_SOURCES, 
  CRYPTO_FOCUSED_SOURCES,
  ECONOMIC_SOURCES,
  getActiveSources,
  getSourcesByCategory,
  getHighReliabilitySources
} from './sources';

// Default export for convenient usage
export { newsAggregator as default } from './news-aggregator';