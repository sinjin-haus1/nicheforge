import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { HooksService } from './hooks.service';
import { Hook, HookInput, GeneratedHooks } from './hook.dto';

@Resolver(() => Hook)
export class HooksResolver {
  constructor(private readonly hooksService: HooksService) {}

  @Query(() => [Hook], { description: 'Get all hooks sorted by viral potential' })
  async hooks(): Promise<Hook[]> {
    return this.hooksService.findAll();
  }

  @Query(() => [Hook], { description: 'Get hooks filtered by niche' })
  async hooksByNiche(@Args('niche') niche: string): Promise<Hook[]> {
    return this.hooksService.findByNiche(niche);
  }

  @Query(() => [Hook], { description: 'Get hooks filtered by type' })
  async hooksByType(@Args('type') type: string): Promise<Hook[]> {
    return this.hooksService.findByType(type);
  }

  @Query(() => [Hook], { description: 'Get top performing hooks' })
  async topHooks(
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 }) limit: number,
  ): Promise<Hook[]> {
    return this.hooksService.topHooks(limit);
  }

  @Query(() => GeneratedHooks, { description: 'Generate viral hooks for a given niche' })
  async generateHooks(
    @Args('niche') niche: string,
    @Args('count', { type: () => Int, nullable: true, defaultValue: 6 }) count: number,
  ): Promise<GeneratedHooks> {
    const hooks = await this.hooksService.generateHooks(niche, count);
    return { niche, hooks, count: hooks.length };
  }

  @Mutation(() => Hook, { description: 'Save a custom hook' })
  async createHook(@Args('input') input: HookInput): Promise<Hook> {
    return this.hooksService.create(input);
  }
}
