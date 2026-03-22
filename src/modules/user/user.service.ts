import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, PLAN_LIMITS } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * Find or create a user from a NextAuth session (called on each authed request).
   */
  async findOrCreate(email: string, name?: string, image?: string): Promise<User> {
    let user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      user = await this.userModel.create({ email, name, image, plan: 'free' });
    } else if (name && user.name !== name) {
      user.name = name;
      user.image = image;
      await user.save();
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  /**
   * Check and increment a usage counter. Throws ForbiddenException if limit reached.
   */
  async checkAndIncrementUsage(
    email: string,
    type: 'nicheSearches' | 'hookGenerations',
  ): Promise<{ used: number; limit: number; remaining: number }> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) throw new ForbiddenException('User not found');

    // Reset counters if we're in a new calendar month
    const resetDate = new Date(user.usageResetAt);
    const now = new Date();
    if (
      now.getMonth() !== resetDate.getMonth() ||
      now.getFullYear() !== resetDate.getFullYear()
    ) {
      user.usageNicheSearches = 0;
      user.usageHookGenerations = 0;
      user.usageResetAt = now.toISOString();
    }

    const limits = PLAN_LIMITS[user.plan] || PLAN_LIMITS.free;
    const limit = limits[type];
    const current =
      type === 'nicheSearches' ? user.usageNicheSearches : user.usageHookGenerations;

    if (current >= limit) {
      throw new ForbiddenException(
        `Monthly limit reached (${limit} ${type} on ${user.plan} plan). Upgrade to continue.`,
      );
    }

    // Increment
    if (type === 'nicheSearches') user.usageNicheSearches += 1;
    else user.usageHookGenerations += 1;
    await user.save();

    return { used: current + 1, limit, remaining: limit - current - 1 };
  }

  async getUsage(email: string): Promise<{
    nicheSearches: number;
    hookGenerations: number;
    resetAt: string;
    plan: string;
    limits: { nicheSearches: number; hookGenerations: number };
  }> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) throw new ForbiddenException('User not found');
    const limits = PLAN_LIMITS[user.plan] || PLAN_LIMITS.free;
    return {
      nicheSearches: user.usageNicheSearches,
      hookGenerations: user.usageHookGenerations,
      resetAt: user.usageResetAt,
      plan: user.plan,
      limits: {
        nicheSearches: isFinite(limits.nicheSearches) ? limits.nicheSearches : 9999,
        hookGenerations: isFinite(limits.hookGenerations) ? limits.hookGenerations : 9999,
      },
    };
  }

  async upgradePlan(email: string, plan: 'pro' | 'unlimited'): Promise<User> {
    const user = await this.userModel.findOneAndUpdate(
      { email },
      { plan },
      { new: true },
    ).exec();
    if (!user) throw new ForbiddenException('User not found');
    return user;
  }
}
