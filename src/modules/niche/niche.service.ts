import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Niche, NicheDocument } from './niche.dto';

@Injectable()
export class NicheService {
  constructor(@InjectModel(Niche.name) private nicheModel: Model<NicheDocument>) {}

  async findAll(): Promise<Niche[]> {
    return this.nicheModel.find().sort({ trendScore: -1 }).exec();
  }

  async findOne(id: string): Promise<Niche> {
    return this.nicheModel.findById(id).exec();
  }

  async search(keyword: string): Promise<Niche[]> {
    return this.nicheModel.find({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } },
      ],
    }).exec();
  }

  async findByCategory(category: string): Promise<Niche[]> {
    return this.nicheModel.find({ category }).sort({ trendScore: -1 }).exec();
  }

  async create(input: Partial<Niche>): Promise<Niche> {
    const niche = new this.nicheModel(input);
    return niche.save();
  }

  // Get trending niches for faceless content
  async getTrendingForFaceless(): Promise<Niche[]> {
    return this.nicheModel.find({
      $or: [
        { category: 'History' },
        { category: 'Science' },
        { category: 'Facts' },
        { category: 'True Crime' },
        { category: 'Motivation' },
        { category: 'Kids' },
        { category: 'Gaming' },
      ],
    }).sort({ trendScore: -1 }).limit(10).exec();
  }

  // Analyze competition for a niche
  async analyzeCompetition(nicheId: string): Promise<any> {
    const niche = await this.nicheModel.findById(nicheId).exec();
    if (!niche) {
      throw new Error('Niche not found');
    }

    // Generate mock competition analysis based on niche data
    const competitionLevel = niche.competition || 'medium';
    const trendScore = niche.trendScore || 50;
    
    // Calculate opportunity score based on competition and trend
    let opportunityScore = 50;
    if (competitionLevel === 'low') opportunityScore += 25;
    else if (competitionLevel === 'high') opportunityScore -= 20;
    
    if (trendScore > 70) opportunityScore += 15;
    else if (trendScore < 40) opportunityScore -= 10;

    const recommendations = [];
    if (opportunityScore > 70) {
      recommendations.push('Excellent opportunity - low competition with high trend');
    } else if (opportunityScore > 50) {
      recommendations.push('Good opportunity - consider this niche for entry');
    } else {
      recommendations.push('High competition - need unique angle to succeed');
    }

    if (niche.category === 'History') {
      recommendations.push('Consider documentary-style narration');
    } else if (niche.category === 'Science') {
      recommendations.push('Use animated visuals for better engagement');
    }

    return {
      nicheId: niche._id,
      nicheName: niche.name,
      competitionLevel,
      competitorCount: competitionLevel === 'low' ? 50 : competitionLevel === 'medium' ? 200 : 500,
      avgChannelAge: competitionLevel === 'low' ? 6 : competitionLevel === 'medium' ? 18 : 36,
      avgSubscribers: competitionLevel === 'low' ? 5000 : competitionLevel === 'medium' ? 25000 : 100000,
      saturationLevel: competitionLevel === 'low' ? 'Low' : competitionLevel === 'medium' ? 'Medium' : 'High',
      opportunityScore: Math.min(100, Math.max(0, opportunityScore)),
      recommendations,
    };
  }

  // Estimate revenue for a niche
  async estimateRevenue(nicheId: string): Promise<any> {
    const niche = await this.nicheModel.findById(nicheId).exec();
    if (!niche) {
      throw new Error('Niche not found');
    }

    const monetizationPotential = niche.monetizationPotential || 'medium';
    const trendScore = niche.trendScore || 50;

    // Calculate estimated views based on trend score
    let estimatedMonthlyViews = '100K-500K';
    if (trendScore > 70) estimatedMonthlyViews = '500K-1M';
    else if (trendScore > 50) estimatedMonthlyViews = '200K-800K';
    else if (trendScore < 30) estimatedMonthlyViews = '10K-100K';

    // CPM ranges based on niche
    let estimatedCPM = '$3-$8';
    if (niche.category === 'Finance' || niche.category === 'Business') {
      estimatedCPM = '$8-$20';
    } else if (niche.category === 'Technology') {
      estimatedCPM = '$5-$12';
    } else if (niche.category === 'Kids') {
      estimatedCPM = '$2-$5';
    }

    // Calculate revenue range
    let estimatedMonthlyRevenue = '$300-$2,000';
    if (monetizationPotential === 'high') {
      estimatedMonthlyRevenue = trendScore > 70 ? '$2,000-$10,000' : '$1,000-$5,000';
    } else if (monetizationPotential === 'medium') {
      estimatedMonthlyRevenue = trendScore > 70 ? '$500-$3,000' : '$200-$1,500';
    } else {
      estimatedMonthlyRevenue = '$50-$500';
    }

    const revenueRange = estimatedMonthlyRevenue;
    const monetizationMethods = ['AdSense', 'Sponsorships', 'Affiliate Marketing', 'Merchandise'];

    return {
      nicheId: niche._id,
      nicheName: niche.name,
      estimatedMonthlyViews,
      estimatedCPM,
      estimatedMonthlyRevenue,
      revenueRange,
      monetizationMethods,
    };
  }
}
