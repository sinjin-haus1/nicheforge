import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Niche, NicheDocument } from './niche.schema';

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
}
