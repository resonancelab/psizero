import { SentimentAnalysis } from './types';

interface SentimentKeywords {
  bullish: string[];
  bearish: string[];
  neutral: string[];
}

export class SentimentAnalyzer {
  private static readonly SENTIMENT_KEYWORDS: SentimentKeywords = {
    bullish: [
      // Positive market terms
      'surge', 'rally', 'bull', 'gain', 'rise', 'jump', 'soar', 'climb', 'boost', 'breakout',
      'uptrend', 'bullish', 'optimistic', 'positive', 'growth', 'profit', 'earnings beat',
      'outperform', 'strong', 'robust', 'healthy', 'recovery', 'rebound', 'momentum',
      'breakthrough', 'innovation', 'expansion', 'acquisition', 'merger', 'partnership',
      'upgraded', 'buy rating', 'overweight', 'recommendation', 'target price increase',
      'beat expectations', 'exceed', 'record high', 'all-time high', 'new high',
      // Crypto specific
      'moon', 'lambo', 'hodl', 'diamond hands', 'pump', 'adoption', 'mainstream',
      'institutional', 'etf approval', 'regulation clarity', 'halving', 'burning'
    ],
    bearish: [
      // Negative market terms
      'crash', 'plunge', 'bear', 'fall', 'drop', 'decline', 'sell-off', 'dump', 'collapse',
      'downtrend', 'bearish', 'pessimistic', 'negative', 'loss', 'deficit', 'earnings miss',
      'underperform', 'weak', 'fragile', 'volatile', 'recession', 'correction', 'pullback',
      'bankruptcy', 'liquidation', 'debt', 'default', 'crisis', 'concern', 'warning',
      'downgraded', 'sell rating', 'underweight', 'target price cut', 'miss expectations',
      'below', 'disappointing', 'record low', 'new low', 'support broken',
      // Crypto specific
      'rekt', 'dump', 'rug pull', 'scam', 'hack', 'exploit', 'fud', 'paper hands',
      'regulatory crackdown', 'ban', 'restrictions', 'delisting', 'investigation'
    ],
    neutral: [
      'stable', 'flat', 'unchanged', 'sideways', 'consolidation', 'range-bound',
      'mixed', 'moderate', 'slight', 'minimal', 'gradual', 'steady', 'hold',
      'maintain', 'neutral', 'balanced', 'wait and see', 'cautious', 'monitoring'
    ]
  };

  private static readonly INTENSITY_MULTIPLIERS = {
    'very': 1.5,
    'extremely': 2.0,
    'highly': 1.4,
    'significantly': 1.6,
    'massively': 1.8,
    'dramatically': 1.7,
    'sharply': 1.5,
    'strongly': 1.4,
    'slightly': 0.5,
    'somewhat': 0.7,
    'moderately': 0.8,
    'barely': 0.3,
    'mildly': 0.6
  };

  private static readonly NEGATION_WORDS = [
    'not', 'no', 'never', 'none', 'nothing', 'nowhere', 'neither', 'nor',
    'cannot', "can't", 'without', 'lack', 'absent', 'missing', 'fail', 'unable'
  ];

  public static analyzeSentiment(title: string, description: string = ''): SentimentAnalysis {
    const text = `${title} ${description}`.toLowerCase();
    const words = text.split(/\W+/).filter(word => word.length > 0);
    
    let bullishScore = 0;
    let bearishScore = 0;
    let neutralScore = 0;
    let totalMatches = 0;

    // Track context for negation handling
    let isNegated = false;
    let intensityMultiplier = 1.0;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      
      // Check for negation words
      if (this.NEGATION_WORDS.includes(word)) {
        isNegated = true;
        continue;
      }

      // Check for intensity modifiers
      if (word in this.INTENSITY_MULTIPLIERS) {
        intensityMultiplier = this.INTENSITY_MULTIPLIERS[word as keyof typeof this.INTENSITY_MULTIPLIERS];
        continue;
      }

      // Score sentiment words
      let wordScore = 0;
      let sentimentType: 'bullish' | 'bearish' | 'neutral' | null = null;

      if (this.SENTIMENT_KEYWORDS.bullish.includes(word)) {
        wordScore = 1 * intensityMultiplier;
        sentimentType = 'bullish';
      } else if (this.SENTIMENT_KEYWORDS.bearish.includes(word)) {
        wordScore = 1 * intensityMultiplier;
        sentimentType = 'bearish';
      } else if (this.SENTIMENT_KEYWORDS.neutral.includes(word)) {
        wordScore = 1 * intensityMultiplier;
        sentimentType = 'neutral';
      }

      if (sentimentType && wordScore > 0) {
        // Apply negation if present
        if (isNegated) {
          // Flip the sentiment for negated words
          if (sentimentType === 'bullish') {
            bearishScore += wordScore;
          } else if (sentimentType === 'bearish') {
            bullishScore += wordScore;
          } else {
            neutralScore += wordScore;
          }
        } else {
          // Normal scoring
          if (sentimentType === 'bullish') {
            bullishScore += wordScore;
          } else if (sentimentType === 'bearish') {
            bearishScore += wordScore;
          } else {
            neutralScore += wordScore;
          }
        }
        
        totalMatches++;
        
        // Reset modifiers after applying
        isNegated = false;
        intensityMultiplier = 1.0;
      }
    }

    // Calculate final sentiment
    const totalScore = bullishScore + bearishScore + neutralScore;
    const magnitude = Math.min(totalScore / Math.max(words.length * 0.1, 1), 1); // Normalize magnitude
    
    let score: number;
    let classification: 'bullish' | 'bearish' | 'neutral';
    let confidence: number;

    if (totalScore === 0) {
      // No sentiment words found
      score = 0;
      classification = 'neutral';
      confidence = 0.1;
    } else {
      // Calculate net sentiment score (-1 to 1)
      score = (bullishScore - bearishScore) / Math.max(totalScore, 1);
      
      // Determine classification
      if (score > 0.2) {
        classification = 'bullish';
      } else if (score < -0.2) {
        classification = 'bearish';
      } else {
        classification = 'neutral';
      }
      
      // Calculate confidence based on score strength and number of matches
      const scoreStrength = Math.abs(score);
      const matchDensity = Math.min(totalMatches / Math.max(words.length * 0.05, 1), 1);
      confidence = Math.min((scoreStrength + matchDensity) / 2, 1);
    }

    return {
      score: Math.max(-1, Math.min(1, score)), // Clamp to [-1, 1]
      magnitude: Math.max(0, Math.min(1, magnitude)), // Clamp to [0, 1]
      classification,
      confidence: Math.max(0, Math.min(1, confidence)) // Clamp to [0, 1]
    };
  }

  // Advanced sentiment analysis using multiple techniques
  public static analyzeAdvancedSentiment(title: string, description: string = ''): SentimentAnalysis {
    const basicSentiment = this.analyzeSentiment(title, description);
    
    // Additional analysis factors
    const titleWeight = 0.7; // Title is more important than description
    const descriptionWeight = 0.3;
    
    const titleSentiment = this.analyzeSentiment(title);
    const descriptionSentiment = this.analyzeSentiment(description);
    
    // Weighted combination
    const combinedScore = (titleSentiment.score * titleWeight) + (descriptionSentiment.score * descriptionWeight);
    const combinedMagnitude = (titleSentiment.magnitude * titleWeight) + (descriptionSentiment.magnitude * descriptionWeight);
    const combinedConfidence = (titleSentiment.confidence * titleWeight) + (descriptionSentiment.confidence * descriptionWeight);
    
    // Determine final classification
    let classification: 'bullish' | 'bearish' | 'neutral';
    if (combinedScore > 0.15) {
      classification = 'bullish';
    } else if (combinedScore < -0.15) {
      classification = 'bearish';
    } else {
      classification = 'neutral';
    }
    
    return {
      score: combinedScore,
      magnitude: combinedMagnitude,
      classification,
      confidence: combinedConfidence
    };
  }

  // Analyze sentiment for crypto-specific content
  public static analyzeCryptoSentiment(title: string, description: string = ''): SentimentAnalysis {
    const sentiment = this.analyzeAdvancedSentiment(title, description);
    
    // Crypto markets are more volatile, so adjust confidence accordingly
    const cryptoVolatilityFactor = 0.8;
    sentiment.confidence *= cryptoVolatilityFactor;
    
    // Look for crypto-specific signals
    const text = `${title} ${description}`.toLowerCase();
    const cryptoBullishSignals = ['etf', 'institutional', 'adoption', 'halving', 'burning', 'upgrade'];
    const cryptoBearishSignals = ['regulation', 'ban', 'hack', 'exploit', 'investigation'];
    
    let cryptoAdjustment = 0;
    
    for (const signal of cryptoBullishSignals) {
      if (text.includes(signal)) {
        cryptoAdjustment += 0.1;
      }
    }
    
    for (const signal of cryptoBearishSignals) {
      if (text.includes(signal)) {
        cryptoAdjustment -= 0.1;
      }
    }
    
    sentiment.score = Math.max(-1, Math.min(1, sentiment.score + cryptoAdjustment));
    
    return sentiment;
  }

  // Batch analyze multiple articles and return aggregate sentiment
  public static analyzeAggregateSentiment(articles: Array<{title: string, description?: string}>): SentimentAnalysis {
    if (articles.length === 0) {
      return {
        score: 0,
        magnitude: 0,
        classification: 'neutral',
        confidence: 0
      };
    }

    const sentiments = articles.map(article => 
      this.analyzeAdvancedSentiment(article.title, article.description || '')
    );

    // Calculate weighted average based on confidence
    let totalWeight = 0;
    let weightedScore = 0;
    let weightedMagnitude = 0;

    for (const sentiment of sentiments) {
      const weight = sentiment.confidence;
      totalWeight += weight;
      weightedScore += sentiment.score * weight;
      weightedMagnitude += sentiment.magnitude * weight;
    }

    if (totalWeight === 0) {
      return {
        score: 0,
        magnitude: 0,
        classification: 'neutral',
        confidence: 0
      };
    }

    const avgScore = weightedScore / totalWeight;
    const avgMagnitude = weightedMagnitude / totalWeight;
    const avgConfidence = totalWeight / articles.length;

    let classification: 'bullish' | 'bearish' | 'neutral';
    if (avgScore > 0.1) {
      classification = 'bullish';
    } else if (avgScore < -0.1) {
      classification = 'bearish';
    } else {
      classification = 'neutral';
    }

    return {
      score: avgScore,
      magnitude: avgMagnitude,
      classification,
      confidence: Math.min(avgConfidence, 1)
    };
  }
}