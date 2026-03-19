import { Model } from 'mongoose';
import { Niche, NicheDocument } from './niche.dto';
export declare class NicheService {
    private nicheModel;
    constructor(nicheModel: Model<NicheDocument>);
    findAll(): Promise<Niche[]>;
    findOne(id: string): Promise<Niche>;
    search(keyword: string): Promise<Niche[]>;
    findByCategory(category: string): Promise<Niche[]>;
    create(input: Partial<Niche>): Promise<Niche>;
    getTrendingForFaceless(): Promise<Niche[]>;
    analyzeCompetition(nicheId: string): Promise<any>;
    estimateRevenue(nicheId: string): Promise<any>;
}
