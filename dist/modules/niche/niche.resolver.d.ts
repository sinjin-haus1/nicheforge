import { NicheService } from './niche.service';
import { Niche, NicheInput, CompetitionAnalysis, RevenueEstimate } from './niche.dto';
export declare class NicheResolver {
    private readonly nicheService;
    constructor(nicheService: NicheService);
    niches(): Promise<Niche[]>;
    niche(id: string): Promise<Niche | null>;
    searchNiches(keyword: string): Promise<Niche[]>;
    nichesByCategory(category: string): Promise<Niche[]>;
    trendingFaceless(): Promise<Niche[]>;
    analyzeCompetition(nicheId: string): Promise<CompetitionAnalysis>;
    estimateRevenue(nicheId: string): Promise<RevenueEstimate>;
    createNiche(input: NicheInput): Promise<Niche>;
}
