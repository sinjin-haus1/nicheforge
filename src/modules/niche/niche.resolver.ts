import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { NicheService } from './niche.service';
import { Niche, NicheInput, CompetitionAnalysis, RevenueEstimate } from './niche.dto';
import { UserService } from '../user/user.service';
import { Public } from '../auth/public.decorator';
import { CurrentUser } from '../auth/current-user.decorator';

interface AuthUser {
  email: string;
  name?: string;
  image?: string;
}

@Resolver(() => Niche)
export class NicheResolver {
  constructor(
    private readonly nicheService: NicheService,
    private readonly userService: UserService,
  ) {}

  // ─── Public (no auth required) ───────────────────────────────────────────────

  @Public()
  @Query(() => [Niche])
  async niches(): Promise<Niche[]> {
    return this.nicheService.findAll();
  }

  @Public()
  @Query(() => Niche, { nullable: true })
  async niche(@Args('id', { type: () => ID }) id: string): Promise<Niche | null> {
    return this.nicheService.findOne(id);
  }

  @Public()
  @Query(() => [Niche])
  async trendingFaceless(): Promise<Niche[]> {
    return this.nicheService.getTrendingForFaceless();
  }

  // ─── Authenticated + usage-tracked ───────────────────────────────────────────

  @Query(() => [Niche])
  async searchNiches(
    @Args('keyword') keyword: string,
    @CurrentUser() user: AuthUser,
  ): Promise<Niche[]> {
    await this.userService.findOrCreate(user.email, user.name, user.image);
    await this.userService.checkAndIncrementUsage(user.email, 'nicheSearches');
    return this.nicheService.search(keyword);
  }

  @Query(() => [Niche])
  async nichesByCategory(
    @Args('category') category: string,
    @CurrentUser() user: AuthUser,
  ): Promise<Niche[]> {
    await this.userService.findOrCreate(user.email, user.name, user.image);
    await this.userService.checkAndIncrementUsage(user.email, 'nicheSearches');
    return this.nicheService.findByCategory(category);
  }

  @Query(() => CompetitionAnalysis)
  async analyzeCompetition(
    @Args('nicheId', { type: () => ID }) nicheId: string,
    @CurrentUser() user: AuthUser,
  ): Promise<CompetitionAnalysis> {
    await this.userService.findOrCreate(user.email, user.name, user.image);
    await this.userService.checkAndIncrementUsage(user.email, 'nicheSearches');
    return this.nicheService.analyzeCompetition(nicheId);
  }

  @Query(() => RevenueEstimate)
  async estimateRevenue(
    @Args('nicheId', { type: () => ID }) nicheId: string,
    @CurrentUser() user: AuthUser,
  ): Promise<RevenueEstimate> {
    await this.userService.findOrCreate(user.email, user.name, user.image);
    return this.nicheService.estimateRevenue(nicheId);
  }

  @Mutation(() => Niche)
  async createNiche(
    @Args('input') input: NicheInput,
    @CurrentUser() user: AuthUser,
  ): Promise<Niche> {
    await this.userService.findOrCreate(user.email, user.name, user.image);
    return this.nicheService.create(input);
  }
}
