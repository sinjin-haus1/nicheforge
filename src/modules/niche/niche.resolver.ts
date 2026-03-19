import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { NicheService } from './niche.service';
import { Niche, NicheInput } from './niche.dto';

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

  @Mutation(() => Niche)
  async createNiche(@Args('input') input: NicheInput): Promise<Niche> {
    return this.nicheService.create(input);
  }
}
