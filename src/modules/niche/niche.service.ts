import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Niche, NicheDocument } from './niche.dto';
import { YoutubeService } from '../youtube/youtube.service';

@Injectable()
export class NicheService {
  constructor(
    @InjectModel(Niche.name) private nicheModel: Model<NicheDocument>,
    private readonly youtubeService: YoutubeService,
  ) {}

  async findAll(): Promise<Niche[]> {
    return this.nicheModel.find().sort({ trendScore: -1 }).exec();
  }

  async findOne(id: string): Promise<Niche> {
    return this.nicheModel.findById(id).exec();
  }

  async search(keyword: string): Promise<Niche[]> {
    return this.nicheModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { category: { $regex: keyword, $options: 'i' } },
        ],
      })
      .exec();
  }

  async findByCategory(category: string): Promise<Niche[]> {
    return this.nicheModel.find({ category }).sort({ trendScore: -1 }).exec();
  }

  async create(input: Partial<Niche>): Promise<Niche> {
    const niche = new this.nicheModel(input);
    return niche.save();
  }

  async getTrendingForFaceless(): Promise<Niche[]> {
    return this.nicheModel
      .find({
        $or: [
          { category: 'History' },
          { category: 'Science' },
          { category: 'Facts' },
          { category: 'True Crime' },
          { category: 'Motivation' },
          { category: 'Kids' },
          { category: 'Gaming' },
        ],
      })
      .sort({ trendScore: -1 })
      .limit(10)
      .exec();
  }

  /**
   * Analyze competition for a niche using REAL YouTube data.
   */
  async analyzeCompetition(nicheId: string): Promise<any> {
    const niche = await this.nicheModel.findById(nicheId).exec();
    if (!niche) throw new Error('Niche not found');

    const liveData = await this.youtubeService.analyzeNiche(niche.name, niche.category);

    const competitionLevel = liveData.totalChannels > 0
      ? liveData.competitionLevel
      : (niche.competition as 'low' | 'medium' | 'high') || 'medium';

    const avgSubscribers = liveData.avgSubscribers > 0
      ? liveData.avgSubscribers
      : this.fallbackAvgSubs(competitionLevel);

    const opportunityScore = liveData.totalChannels > 0
      ? liveData.opportunityScore
      : this.fallbackOpportunityScore(competitionLevel, niche.trendScore || 50);

    const recommendations = this.buildRecommendations(
      opportunityScore,
      niche.category,
      competitionLevel,
      liveData.topChannels,
    );

    return {
      nicheId: niche._id,
      nicheName: niche.name,
      competitionLevel,
      competitorCount: liveData.totalChannels || this.fallbackCompetitorCount(competitionLevel),
      avgChannelAge: this.estimateChannelAge(competitionLevel),
      avgSubscribers,
      saturationLevel: competitionLevel === 'low' ? 'Low' : competitionLevel === 'medium' ? 'Medium' : 'High',
      opportunityScore,
      recommendations,
    };
  }

  /**
   * Estimate revenue using REAL YouTube video view data + CPM ranges.
   */
  async estimateRevenue(nicheId: string): Promise<any> {
    const niche = await this.nicheModel.findById(nicheId).exec();
    if (!niche) throw new Error('Niche not found');

    const liveRevenue = await this.youtubeService.estimateNicheRevenue(
      niche.name,
      niche.category,
    );

    return {
      nicheId: niche._id,
      nicheName: niche.name,
      ...liveRevenue,
    };
  }

  // ─── Fallback helpers ────────────────────────────────────────────────────────

  private fallbackAvgSubs(level: string): number {
    return level === 'low' ? 8_000 : level === 'medium' ? 75_000 : 350_000;
  }

  private fallbackCompetitorCount(level: string): number {
    return level === 'low' ? 50 : level === 'medium' ? 200 : 500;
  }

  private fallbackOpportunityScore(level: string, trendScore: number): number {
    let score = 50;
    if (level === 'low') score += 25;
    else if (level === 'high') score -= 20;
    if (trendScore > 70) score += 15;
    else if (trendScore < 40) score -= 10;
    return Math.min(100, Math.max(0, score));
  }

  private estimateChannelAge(level: string): number {
    return level === 'low' ? 8 : level === 'medium' ? 24 : 48;
  }

  private buildRecommendations(
    score: number,
    category: string,
    level: string,
    topChannels: any[],
  ): string[] {
    const recs: string[] = [];

    if (score >= 70) recs.push('Strong opportunity — low competition, high demand. Move fast.');
    else if (score >= 50) recs.push('Solid opportunity — find a unique angle or sub-niche.');
    else recs.push('Highly competitive — exceptional production or a fresh angle required.');

    const categoryAdvice: Record<string, string> = {
      History: 'Use documentary-style narration with stock footage. Focus on untold stories.',
      Science: 'Animated visuals and simple analogies outperform lecture-style content.',
      'True Crime': 'Consistent upload schedule (2x/week) is critical for algorithm growth.',
      Finance: 'High CPM niche — prioritize SEO titles and evergreen topics for long-tail traffic.',
      Motivation: 'Shorts are especially effective — post daily hooks to grow fast.',
      Gaming: 'Retro gaming and nostalgia sub-niches have lower competition than current titles.',
      Kids: 'Animation quality matters more than budget — consistency wins.',
    };
    if (categoryAdvice[category]) recs.push(categoryAdvice[category]);

    if (topChannels.length > 0) {
      const largest = topChannels.reduce((a, b) =>
        a.subscriberCount > b.subscriberCount ? a : b,
      );
      if (largest.subscriberCount > 0) {
        const formatted =
          largest.subscriberCount >= 1_000_000
            ? `${(largest.subscriberCount / 1_000_000).toFixed(1)}M`
            : `${Math.round(largest.subscriberCount / 1000)}K`;
        recs.push(`Top channel in this niche: "${largest.title}" with ${formatted} subscribers.`);
      }
    }

    if (level === 'low') recs.push('First-mover advantage available — this niche is underserved.');

    return recs;
  }
}
