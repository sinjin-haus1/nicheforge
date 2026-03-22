import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { HooksService } from './hooks.service';
import { Hook, HookInput, GeneratedHooks } from './hook.dto';
import { UserService } from '../user/user.service';
import { Public } from '../auth/public.decorator';
import { CurrentUser } from '../auth/current-user.decorator';

interface AuthUser {
  email: string;
  name?: string;
  image?: string;
}

@Resolver(() => Hook)
export class HooksResolver {
  constructor(
    private readonly hooksService: HooksService,
    private readonly userService: UserService,
  ) {}

  // ─── Public ──────────────────────────────────────────────────────────────────

  @Public()
  @Query(() => [Hook], { description: 'Get top performing hooks (public)' })
  async topHooks(
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 }) limit: number,
  ): Promise<Hook[]> {
    return this.hooksService.topHooks(limit);
  }

  // ─── Authenticated + usage-tracked ───────────────────────────────────────────

  @Query(() => [Hook], { description: 'Get all hooks sorted by viral potential' })
  async hooks(@CurrentUser() user: AuthUser): Promise<Hook[]> {
    await this.userService.findOrCreate(user.email, user.name, user.image);
    return this.hooksService.findAll();
  }

  @Query(() => [Hook], { description: 'Get hooks filtered by niche' })
  async hooksByNiche(
    @Args('niche') niche: string,
    @CurrentUser() user: AuthUser,
  ): Promise<Hook[]> {
    await this.userService.findOrCreate(user.email, user.name, user.image);
    return this.hooksService.findByNiche(niche);
  }

  @Query(() => [Hook], { description: 'Get hooks filtered by type' })
  async hooksByType(
    @Args('type') type: string,
    @CurrentUser() user: AuthUser,
  ): Promise<Hook[]> {
    await this.userService.findOrCreate(user.email, user.name, user.image);
    return this.hooksService.findByType(type);
  }

  @Query(() => GeneratedHooks, { description: 'Generate viral hooks for a given niche' })
  async generateHooks(
    @Args('niche') niche: string,
    @Args('count', { type: () => Int, nullable: true, defaultValue: 6 }) count: number,
    @CurrentUser() user: AuthUser,
  ): Promise<GeneratedHooks> {
    await this.userService.findOrCreate(user.email, user.name, user.image);
    await this.userService.checkAndIncrementUsage(user.email, 'hookGenerations');
    const hooks = await this.hooksService.generateHooks(niche, count);
    return { niche, hooks, count: hooks.length };
  }

  @Mutation(() => Hook, { description: 'Save a custom hook' })
  async createHook(
    @Args('input') input: HookInput,
    @CurrentUser() user: AuthUser,
  ): Promise<Hook> {
    await this.userService.findOrCreate(user.email, user.name, user.image);
    return this.hooksService.create(input);
  }
}
