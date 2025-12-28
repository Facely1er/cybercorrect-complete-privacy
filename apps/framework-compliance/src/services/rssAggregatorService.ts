/**
 * RSS Aggregator Service
 * 
 * This service aggregates regulatory updates from multiple RSS feeds
 * instead of fetching directly from individual sources.
 * 
 * The aggregator provides:
 * - Centralized feed management
 * - Rate limiting and caching
 * - Normalized data format
 * - Error handling and retry logic
 */

import { supabase } from '../lib/supabase';
import { errorMonitoring } from '../lib/errorMonitoring';

export interface RSSFeedSource {
  id: string;
  name: string;
  url: string;
  framework: string;
  region?: string;
  enabled: boolean;
  lastFetched?: string;
  updateFrequency: 'hourly' | 'daily' | 'weekly';
}

export interface RSSFeedItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  guid?: string;
  categories?: string[];
  author?: string;
}

export interface AggregatedRegulatoryUpdate {
  title: string;
  description: string;
  link: string;
  publishedAt: string;
  framework: string;
  region?: string;
  source: string;
  guid?: string;
  categories?: string[];
}

class RSSAggregatorService {
  private readonly CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour cache
  private cache: Map<string, { data: AggregatedRegulatoryUpdate[]; timestamp: number }> = new Map();

  /**
   * Get all configured RSS feed sources from the aggregator
   */
  async getFeedSources(): Promise<RSSFeedSource[]> {
    try {
      // Fetch from RSS feed sources table (managed by aggregator)
      const { data, error } = await supabase
        .from('rss_feed_sources')
        .select('*')
        .eq('enabled', true)
        .order('name');

      if (error) throw error;

      return (data as RSSFeedSource[]) || [];
    } catch (error) {
      console.error('Failed to fetch RSS feed sources:', error);
      errorMonitoring.captureException(error as Error, {
        context: 'RSSAggregatorService.getFeedSources',
      });
      return [];
    }
  }

  /**
   * Fetch and aggregate regulatory updates from RSS Aggregator endpoint
   * This replaces direct feed fetching with a centralized aggregator approach
   */
  async fetchAggregatedUpdates(frameworks?: string[]): Promise<AggregatedRegulatoryUpdate[]> {
    try {
      const cacheKey = `aggregated_updates_${frameworks?.join(',') || 'all'}`;
      const cached = this.cache.get(cacheKey);

      // Return cached data if still valid
      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL_MS) {
        return cached.data;
      }

      // Fetch from RSS Aggregator API endpoint
      // The aggregator handles fetching from all configured RSS feeds
      const aggregatorUrl = import.meta.env.VITE_RSS_AGGREGATOR_URL || 
                           'https://api.cybercorrect.com/rss-aggregator/regulatory-updates';

      const params = new URLSearchParams();
      if (frameworks && frameworks.length > 0) {
        params.append('frameworks', frameworks.join(','));
      }
      params.append('limit', '100');

      const response = await fetch(`${aggregatorUrl}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`RSS Aggregator API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Normalize the aggregated data
      const updates: AggregatedRegulatoryUpdate[] = (data.updates || []).map((item: any) => ({
        title: item.title || '',
        description: item.description || item.summary || '',
        link: item.link || item.url || '',
        publishedAt: item.publishedAt || item.pubDate || item.published_at || new Date().toISOString(),
        framework: item.framework || 'Unknown',
        region: item.region,
        source: item.source || item.feedName || 'Unknown',
        guid: item.guid || item.id,
        categories: item.categories || item.tags || [],
      }));

      // Cache the results
      this.cache.set(cacheKey, {
        data: updates,
        timestamp: Date.now(),
      });

      return updates;
    } catch (error) {
      console.error('Failed to fetch aggregated updates from RSS Aggregator:', error);
      errorMonitoring.captureException(error as Error, {
        context: 'RSSAggregatorService.fetchAggregatedUpdates',
        extra: { frameworks },
      });

      // Fallback to database if aggregator is unavailable
      return this.fallbackToDatabase(frameworks);
    }
  }

  /**
   * Fallback method: fetch from database if RSS Aggregator is unavailable
   * This ensures the system continues to work even if the aggregator is down
   */
  private async fallbackToDatabase(frameworks?: string[]): Promise<AggregatedRegulatoryUpdate[]> {
    try {
      let query = supabase
        .from('regulatory_updates')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(100);

      if (frameworks && frameworks.length > 0) {
        query = query.in('framework', frameworks);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map((item: any) => ({
        title: item.title || '',
        description: item.description || '',
        link: item.link || '',
        publishedAt: item.published_at || item.publishedAt || new Date().toISOString(),
        framework: item.framework || 'Unknown',
        region: item.region,
        source: item.source || 'Database',
        guid: item.id,
        categories: item.categories || [],
      }));
    } catch (error) {
      console.error('Fallback to database also failed:', error);
      return [];
    }
  }

  /**
   * Sync aggregated updates to the database
   * This is typically called by a background job that fetches from the RSS Aggregator
   */
  async syncAggregatedUpdatesToDatabase(): Promise<{ synced: number; errors: number }> {
    try {
      const updates = await this.fetchAggregatedUpdates();
      let synced = 0;
      let errors = 0;

      for (const update of updates) {
        try {
          // Check if update already exists (by guid or link)
          const { data: existing } = await supabase
            .from('regulatory_updates')
            .select('id')
            .or(`guid.eq.${update.guid || ''},link.eq.${update.link}`)
            .limit(1)
            .single();

          if (!existing) {
            // Determine impact level based on framework and keywords
            const impactLevel = this.assessImpactLevel(update);

            // Insert new update
            const { error: insertError } = await supabase
              .from('regulatory_updates')
              .insert({
                framework: update.framework,
                region: update.region,
                update_type: this.determineUpdateType(update),
                title: update.title,
                description: update.description,
                impact_level: impactLevel,
                published_at: update.publishedAt,
                link: update.link,
                guid: update.guid,
                metadata: {
                  source: update.source,
                  categories: update.categories,
                  aggregated: true,
                },
              });

            if (insertError) {
              console.error(`Failed to insert update: ${update.title}`, insertError);
              errors++;
            } else {
              synced++;
            }
          }
        } catch (error) {
          console.error(`Error processing update: ${update.title}`, error);
          errors++;
        }
      }

      return { synced, errors };
    } catch (error) {
      console.error('Failed to sync aggregated updates:', error);
      errorMonitoring.captureException(error as Error, {
        context: 'RSSAggregatorService.syncAggregatedUpdatesToDatabase',
      });
      return { synced: 0, errors: 0 };
    }
  }

  /**
   * Assess impact level based on update content
   */
  private assessImpactLevel(update: AggregatedRegulatoryUpdate): 'low' | 'medium' | 'high' | 'critical' {
    const titleLower = update.title.toLowerCase();
    const descLower = update.description.toLowerCase();
    const combined = `${titleLower} ${descLower}`;

    // Critical keywords
    if (combined.match(/\b(critical|urgent|immediate|breach|violation|penalty|fine|enforcement)\b/i)) {
      return 'critical';
    }

    // High impact keywords
    if (combined.match(/\b(new regulation|amendment|compliance|deadline|requirement|mandatory)\b/i)) {
      return 'high';
    }

    // Medium impact keywords
    if (combined.match(/\b(guidance|update|change|revision|clarification)\b/i)) {
      return 'medium';
    }

    return 'low';
  }

  /**
   * Determine update type from content
   */
  private determineUpdateType(update: AggregatedRegulatoryUpdate): 'new_regulation' | 'amendment' | 'guidance' | 'enforcement' | 'other' {
    const titleLower = update.title.toLowerCase();
    const descLower = update.description.toLowerCase();
    const combined = `${titleLower} ${descLower}`;

    if (combined.match(/\b(new regulation|new law|new rule)\b/i)) {
      return 'new_regulation';
    }
    if (combined.match(/\b(amendment|amended|revised|updated regulation)\b/i)) {
      return 'amendment';
    }
    if (combined.match(/\b(guidance|guidelines|best practices|recommendations)\b/i)) {
      return 'guidance';
    }
    if (combined.match(/\b(enforcement|penalty|fine|violation|sanction)\b/i)) {
      return 'enforcement';
    }

    return 'other';
  }

  /**
   * Clear cache (useful for testing or manual refresh)
   */
  clearCache(): void {
    this.cache.clear();
  }
}

export const rssAggregatorService = new RSSAggregatorService();

