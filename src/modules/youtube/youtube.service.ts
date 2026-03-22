import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, youtube_v3 } from 'googleapis';

export interface ChannelSummary {
  channelId: string;
  title: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  publishedAt: string;
}

export interface NicheAnalysisData {
  totalChannels: number;
  avgSubscribers: number;
  avgViews: number;
  topChannels: ChannelSummary[];
  competitionLevel: 'low' | 'medium' | 'high';
  opportunityScore: number;
}

export interface TrendingVideoData {
  videoId: string;
  title: string;
  viewCount: number;
  likeCount: number;
  channelTitle: string;
  publishedAt: string;
  tags: string[];
}

@Injectable()
export class YoutubeService {
  private readonly logger = new Logger(YoutubeService.name);
  private readonly youtube: youtube_v3.Youtube;

  // CPM estimates per category (USD per 1000 views)
  private readonly CPM_BY_CATEGORY: Record<string, { low: number; high: number }> = {
    Finance: { low: 8, high: 20 },
    Business: { low: 7, high: 18 },
    Technology: { low: 5, high: 12 },
    'True Crime': { low: 3, high: 8 },
    History: { low: 3, high: 7 },
    Science: { low: 3, high: 7 },
    Motivation: { low: 4, high: 10 },
    Gaming: { low: 2, high: 5 },
    Kids: { low: 2, high: 5 },
    General: { low: 2, high: 6 },
  };

  constructor(private configService: ConfigService) {
    this.youtube = google.youtube({
      version: 'v3',
      auth: this.configService.get<string>('YOUTUBE_API_KEY'),
    });
  }

  /**
   * Search for YouTube channels by keyword and return summary stats.
   */
  async searchChannels(keyword: string, maxResults = 10): Promise<ChannelSummary[]> {
    try {
      // Step 1: Search for channels
      const searchRes = await this.youtube.search.list({
        part: ['snippet'],
        q: keyword,
        type: ['channel'],
        maxResults,
        relevanceLanguage: 'en',
        regionCode: 'US',
      });

      const channelIds = (searchRes.data.items || [])
        .map((item) => item.snippet?.channelId)
        .filter(Boolean) as string[];

      if (!channelIds.length) return [];

      // Step 2: Get detailed stats for each channel
      const statsRes = await this.youtube.channels.list({
        part: ['statistics', 'snippet'],
        id: channelIds,
      });

      return (statsRes.data.items || []).map((ch) => ({
        channelId: ch.id || '',
        title: ch.snippet?.title || '',
        subscriberCount: parseInt(ch.statistics?.subscriberCount || '0', 10),
        viewCount: parseInt(ch.statistics?.viewCount || '0', 10),
        videoCount: parseInt(ch.statistics?.videoCount || '0', 10),
        publishedAt: ch.snippet?.publishedAt || '',
      }));
    } catch (err) {
      this.logger.error(`YouTube channel search failed for "${keyword}": ${err.message}`);
      return [];
    }
  }

  /**
   * Search for trending videos in a niche to gauge content demand.
   */
  async searchVideos(keyword: string, maxResults = 10): Promise<TrendingVideoData[]> {
    try {
      const searchRes = await this.youtube.search.list({
        part: ['snippet'],
        q: keyword,
        type: ['video'],
        maxResults,
        order: 'viewCount',
        relevanceLanguage: 'en',
        regionCode: 'US',
        publishedAfter: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // last 90 days
      });

      const videoIds = (searchRes.data.items || [])
        .map((item) => item.id?.videoId)
        .filter(Boolean) as string[];

      if (!videoIds.length) return [];

      const statsRes = await this.youtube.videos.list({
        part: ['statistics', 'snippet'],
        id: videoIds,
      });

      return (statsRes.data.items || []).map((v) => ({
        videoId: v.id || '',
        title: v.snippet?.title || '',
        viewCount: parseInt(v.statistics?.viewCount || '0', 10),
        likeCount: parseInt(v.statistics?.likeCount || '0', 10),
        channelTitle: v.snippet?.channelTitle || '',
        publishedAt: v.snippet?.publishedAt || '',
        tags: v.snippet?.tags?.slice(0, 5) || [],
      }));
    } catch (err) {
      this.logger.error(`YouTube video search failed for "${keyword}": ${err.message}`);
      return [];
    }
  }

  /**
   * Full niche analysis: fetch real channel data and derive competition + opportunity scores.
   */
  async analyzeNiche(keyword: string, category = 'General'): Promise<NicheAnalysisData> {
    const channels = await this.searchChannels(keyword, 15);

    if (!channels.length) {
      return this.fallbackAnalysis(category);
    }

    const subscriberCounts = channels.map((c) => c.subscriberCount).filter((s) => s > 0);
    const viewCounts = channels.map((c) => c.viewCount).filter((v) => v > 0);

    const avgSubscribers =
      subscriberCounts.length > 0
        ? Math.round(subscriberCounts.reduce((a, b) => a + b, 0) / subscriberCounts.length)
        : 0;

    const avgViews =
      viewCounts.length > 0
        ? Math.round(viewCounts.reduce((a, b) => a + b, 0) / viewCounts.length)
        : 0;

    // Determine competition level based on avg subscriber counts
    let competitionLevel: 'low' | 'medium' | 'high';
    if (avgSubscribers < 50_000) competitionLevel = 'low';
    else if (avgSubscribers < 500_000) competitionLevel = 'medium';
    else competitionLevel = 'high';

    // Opportunity score: high views + low subs = trending/underserved
    let opportunityScore = 50;
    if (competitionLevel === 'low') opportunityScore += 25;
    else if (competitionLevel === 'high') opportunityScore -= 20;
    if (avgViews > 1_000_000) opportunityScore += 15;
    else if (avgViews < 100_000) opportunityScore -= 10;

    return {
      totalChannels: channels.length,
      avgSubscribers,
      avgViews,
      topChannels: channels.slice(0, 5),
      competitionLevel,
      opportunityScore: Math.min(100, Math.max(0, opportunityScore)),
    };
  }

  /**
   * Estimate monthly revenue for a niche based on real view data + CPM ranges.
   */
  async estimateNicheRevenue(
    keyword: string,
    category = 'General',
  ): Promise<{
    estimatedMonthlyViews: string;
    estimatedCPM: string;
    estimatedMonthlyRevenue: string;
    revenueRange: string;
    monetizationMethods: string[];
  }> {
    const videos = await this.searchVideos(keyword, 10);
    const cpm = this.CPM_BY_CATEGORY[category] || this.CPM_BY_CATEGORY['General'];

    let avgMonthlyViews = 200_000; // default fallback

    if (videos.length > 0) {
      const totalViews = videos.reduce((sum, v) => sum + v.viewCount, 0);
      avgMonthlyViews = Math.round(totalViews / videos.length / 3); // 90-day window → monthly
    }

    const lowRevenue = Math.round((avgMonthlyViews / 1000) * cpm.low);
    const highRevenue = Math.round((avgMonthlyViews / 1000) * cpm.high);

    const formatViews = (n: number) =>
      n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : `${Math.round(n / 1000)}K`;

    const formatMoney = (n: number) =>
      n >= 1000 ? `$${(n / 1000).toFixed(1)}K` : `$${n}`;

    return {
      estimatedMonthlyViews: `${formatViews(avgMonthlyViews / 2)}–${formatViews(avgMonthlyViews * 1.5)}`,
      estimatedCPM: `$${cpm.low}–$${cpm.high}`,
      estimatedMonthlyRevenue: `${formatMoney(lowRevenue)}–${formatMoney(highRevenue)}/mo`,
      revenueRange: `${formatMoney(lowRevenue)}–${formatMoney(highRevenue)}`,
      monetizationMethods: this.getMonetizationMethods(category),
    };
  }

  private getMonetizationMethods(category: string): string[] {
    const base = ['AdSense', 'Sponsorships'];
    const extras: Record<string, string[]> = {
      Finance: ['Affiliate (brokers, tools)', 'Digital products', 'Courses'],
      Technology: ['Affiliate (software)', 'Sponsored reviews'],
      Motivation: ['Courses', 'Coaching', 'Merchandise'],
      History: ['Patreon', 'Merchandise', 'Books'],
      'True Crime': ['Patreon', 'Merchandise', 'Podcast'],
      Gaming: ['Memberships', 'Merchandise', 'Game affiliate'],
      Kids: ['Merchandise', 'YouTube Memberships'],
    };
    return [...base, ...(extras[category] || ['Affiliate Marketing', 'Digital Products'])];
  }

  private fallbackAnalysis(category: string): NicheAnalysisData {
    return {
      totalChannels: 0,
      avgSubscribers: 0,
      avgViews: 0,
      topChannels: [],
      competitionLevel: 'medium',
      opportunityScore: 50,
    };
  }
}
