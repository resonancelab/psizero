import { ParsedFeed, RSSFeedItem } from './types';

export class RSSParser {
  private static parseXMLString(xmlString: string): Document {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'text/xml');
    
    // Check for parsing errors
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      throw new Error(`XML parsing error: ${parserError.textContent}`);
    }
    
    return doc;
  }

  private static getTextContent(element: Element | null): string {
    return element?.textContent?.trim() || '';
  }

  private static extractCDATA(text: string): string {
    // Remove CDATA wrapper if present
    return text.replace(/^<!\[CDATA\[(.*?)\]\]>$/s, '$1').trim();
  }

  private static parseRSSDate(dateString: string): Date {
    if (!dateString) return new Date();
    
    // Try standard formats first
    const standardDate = new Date(dateString);
    if (!isNaN(standardDate.getTime())) {
      return standardDate;
    }

    // Handle common RSS date formats
    const formats = [
      // RFC 2822 format: "Wed, 09 Dec 2020 10:30:00 GMT"
      /^(\w+),\s+(\d+)\s+(\w+)\s+(\d+)\s+(\d+):(\d+):(\d+)\s+([+-]\d{4}|\w+)$/,
      // ISO format variations
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})([+-]\d{2}:\d{2}|Z)?$/
    ];

    for (const format of formats) {
      if (format.test(dateString)) {
        const parsed = new Date(dateString);
        if (!isNaN(parsed.getTime())) {
          return parsed;
        }
      }
    }

    // Fallback to current date if parsing fails
    console.warn(`Could not parse date: ${dateString}`);
    return new Date();
  }

  private static parseRSSItem(itemElement: Element): RSSFeedItem {
    const title = this.extractCDATA(this.getTextContent(itemElement.querySelector('title')));
    const description = this.extractCDATA(this.getTextContent(itemElement.querySelector('description')));
    
    // Handle content:encoded with namespace-aware approach
    let content = '';
    const contentNodes = itemElement.getElementsByTagName('content:encoded');
    if (contentNodes.length > 0) {
      content = this.extractCDATA(this.getTextContent(contentNodes[0]));
    } else {
      // Try alternative patterns
      const encodedNodes = itemElement.getElementsByTagName('encoded');
      if (encodedNodes.length > 0) {
        content = this.extractCDATA(this.getTextContent(encodedNodes[0]));
      }
    }
    
    const link = this.getTextContent(itemElement.querySelector('link'));
    const pubDate = this.getTextContent(itemElement.querySelector('pubDate'));
    const guid = this.getTextContent(itemElement.querySelector('guid'));
    const category = this.getTextContent(itemElement.querySelector('category'));
    
    // Handle author with namespace-aware approach
    let author = this.getTextContent(itemElement.querySelector('author'));
    if (!author) {
      const dcCreatorNodes = itemElement.getElementsByTagName('dc:creator');
      if (dcCreatorNodes.length > 0) {
        author = this.getTextContent(dcCreatorNodes[0]);
      } else {
        const creatorNodes = itemElement.getElementsByTagName('creator');
        if (creatorNodes.length > 0) {
          author = this.getTextContent(creatorNodes[0]);
        }
      }
    }

    // Handle enclosures (images, media)
    const enclosureElement = itemElement.querySelector('enclosure');
    const enclosure = enclosureElement ? {
      url: enclosureElement.getAttribute('url') || '',
      type: enclosureElement.getAttribute('type') || ''
    } : undefined;

    return {
      title,
      description,
      content: content || undefined,
      link,
      pubDate,
      guid: guid || link, // Use link as fallback for guid
      category,
      author,
      enclosure
    };
  }

  private static parseAtomItem(entryElement: Element): RSSFeedItem {
    const title = this.extractCDATA(this.getTextContent(entryElement.querySelector('title')));
    const summary = this.extractCDATA(this.getTextContent(entryElement.querySelector('summary')));
    const content = this.extractCDATA(this.getTextContent(entryElement.querySelector('content')));
    const description = content || summary;
    
    // Atom feeds use <link> differently
    const linkElement = entryElement.querySelector('link[rel="alternate"]') || entryElement.querySelector('link');
    const link = linkElement?.getAttribute('href') || '';
    
    const published = this.getTextContent(entryElement.querySelector('published'));
    const updated = this.getTextContent(entryElement.querySelector('updated'));
    const pubDate = published || updated;
    
    const id = this.getTextContent(entryElement.querySelector('id'));
    const category = this.getTextContent(entryElement.querySelector('category'));
    const author = this.getTextContent(entryElement.querySelector('author name'));

    return {
      title,
      description,
      content: content || undefined,
      link,
      pubDate,
      guid: id || link,
      category,
      author
    };
  }

  public static async fetchAndParse(url: string, timeout: number = 10000): Promise<ParsedFeed> {
    try {
      console.log(`🔄 [RSSParser] Fetching RSS feed: ${url}`);
      
      // Use our own RSS proxy for reliable CORS handling
      const proxyUrl = `http://localhost:8080/v1/rss-proxy/fetch`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(proxyUrl, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ url })
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.warn(`⚠️ [RSSParser] RSS proxy error for ${url}:`, errorData);
        
        // Return empty feed on proxy errors to prevent breaking the app
        return {
          title: 'Feed Temporarily Unavailable',
          description: `Unable to fetch RSS feed from ${url}`,
          link: url,
          lastBuildDate: new Date().toISOString(),
          items: []
        };
      }

      const responseData = await response.json();
      
      // Check if the response has the expected structure
      if (!responseData.data || !responseData.data.contents) {
        console.warn(`⚠️ [RSSParser] Invalid response format from RSS proxy for ${url}`);
        return {
          title: 'Feed Format Error',
          description: `Invalid RSS feed format from ${url}`,
          link: url,
          lastBuildDate: new Date().toISOString(),
          items: []
        };
      }

      const xmlString = responseData.data.contents;

      if (!xmlString) {
        console.warn(`⚠️ [RSSParser] No XML content received from RSS proxy for ${url}`);
        return {
          title: 'Empty Feed',
          description: `No content available from ${url}`,
          link: url,
          lastBuildDate: new Date().toISOString(),
          items: []
        };
      }

      console.log(`✅ [RSSParser] Successfully fetched ${xmlString.length} bytes from ${url}`);
      
      try {
        return this.parseXML(xmlString);
      } catch (parseError) {
        console.error(`❌ [RSSParser] Failed to parse XML from ${url}:`, parseError);
        return {
          title: 'Parse Error',
          description: `Failed to parse RSS feed from ${url}`,
          link: url,
          lastBuildDate: new Date().toISOString(),
          items: []
        };
      }
      
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error(`⏱️ [RSSParser] Request timeout after ${timeout}ms for ${url}`);
      } else {
        console.error(`❌ [RSSParser] Failed to fetch ${url}:`, error);
      }
      
      // Always return a valid feed structure to prevent app crashes
      return {
        title: 'Feed Error',
        description: `Error fetching RSS feed from ${url}`,
        link: url,
        lastBuildDate: new Date().toISOString(),
        items: []
      };
    }
  }

  public static parseXML(xmlString: string): ParsedFeed {
    try {
      const doc = this.parseXMLString(xmlString);
      
      // Detect feed type (RSS vs Atom)
      const isAtom = doc.querySelector('feed[xmlns*="atom"]') !== null;
      const isRSS = doc.querySelector('rss') !== null || doc.querySelector('channel') !== null;

      if (isAtom) {
        return this.parseAtomFeed(doc);
      } else if (isRSS) {
        return this.parseRSSFeed(doc);
      } else {
        throw new Error('Unrecognized feed format');
      }
    } catch (error) {
      console.error('RSS parsing error:', error);
      throw new Error(`Failed to parse RSS feed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static parseRSSFeed(doc: Document): ParsedFeed {
    const channel = doc.querySelector('channel');
    if (!channel) {
      throw new Error('Invalid RSS feed: no channel element found');
    }

    const title = this.getTextContent(channel.querySelector('title'));
    const description = this.extractCDATA(this.getTextContent(channel.querySelector('description')));
    const link = this.getTextContent(channel.querySelector('link'));
    const lastBuildDate = this.getTextContent(channel.querySelector('lastBuildDate'));

    const items = Array.from(channel.querySelectorAll('item'))
      .map(item => this.parseRSSItem(item))
      .filter(item => item.title && item.link); // Filter out invalid items

    return {
      title,
      description,
      link,
      lastBuildDate,
      items
    };
  }

  private static parseAtomFeed(doc: Document): ParsedFeed {
    const feed = doc.querySelector('feed');
    if (!feed) {
      throw new Error('Invalid Atom feed: no feed element found');
    }

    const title = this.getTextContent(feed.querySelector('title'));
    const subtitle = this.getTextContent(feed.querySelector('subtitle'));
    const description = subtitle;
    
    const linkElement = feed.querySelector('link[rel="alternate"]') || feed.querySelector('link');
    const link = linkElement?.getAttribute('href') || '';
    
    const updated = this.getTextContent(feed.querySelector('updated'));

    const items = Array.from(feed.querySelectorAll('entry'))
      .map(entry => this.parseAtomItem(entry))
      .filter(item => item.title && item.link);

    return {
      title,
      description,
      link,
      lastBuildDate: updated,
      items
    };
  }

  // Utility method to clean and normalize text content
  public static cleanText(text: string): string {
    if (!text) return '';
    
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
      .replace(/&amp;/g, '&') // Decode HTML entities
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  // Extract stock symbols from text (basic implementation)
  public static extractSymbols(text: string): string[] {
    const symbolPattern = /\$([A-Z]{1,5})\b/g;
    const matches = text.match(symbolPattern);
    return matches ? matches.map(match => match.substring(1)) : [];
  }

  // Extract keywords from title and description
  public static extractKeywords(title: string, description: string): string[] {
    const combined = `${title} ${description}`.toLowerCase();
    const stopWords = new Set(['the', 'is', 'at', 'which', 'on', 'and', 'a', 'to', 'are', 'as', 'was', 'will', 'be']);
    
    return combined
      .split(/\W+/)
      .filter(word => word.length > 3 && !stopWords.has(word))
      .slice(0, 10); // Limit to 10 keywords
  }
}