import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { NicheService } from './niche.service';
import { Niche, NicheInput, CompetitionAnalysis, RevenueEstimate } from './niche.dto';

@Resolver(() => Niche)
export class NicheResolver {
  constructor(private readonly nicheService: NicheService) {}

  @Query(() => [Niche])
  async niches(): Promise<Niche[]> {
    return this.nicheService.findAll();
  }

  @Query(() => Niche, { nullable: true })
  async niche(@Args('id', { type: () => ID }) id: string): Promise<Niche | null> {
    return this.nicheService.findOne(id);
  }

  @Query(() => [Niche])
  async searchNiches(@Args('keyword') keyword: string): Promise<Niche[]> {
    return this.nicheService.search(keyword);
  }

  @Query(() => [Niche])
  async nichesByCategory(@Args('category') category: string): Promise<Niche[]> {
    return this.nicheService.findByCategory(category);
  }

  @Query(() => [Niche])
  async trendingFaceless(): Promise<Niche[]> {
    return this.nicheService.getTrendingForFaceless();
  }

  @Query(() => CompetitionAnalysis)
  async analyzeCompetition(@Args('nicheId', { type: () => ID }) nicheId: string): Promise<CompetitionAnalysis> {
    return this.nicheService.analyzeCompetition(nicheId);
  }

  @Query(() => RevenueEstimate)
  async estimateRevenue(@Args('nicheId', { type: () => ID }) nicheId: string): Promise<RevenueEstimate> {
    return this.nicheService.estimateRevenue(nicheId);
  }

  @Mutation(() => Niche)
  async createNiche(@Args('input') input: NicheInput): Promise<Niche> {
    return this.nicheService.create(input);
  }
}
