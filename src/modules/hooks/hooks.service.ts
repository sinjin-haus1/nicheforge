import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hook, HookDocument, HookInput, HookType } from './hook.dto';

// Hook templates by type — these seed the generation logic
const HOOK_TEMPLATES: Record<string, string[]> = {
  [HookType.QUESTION]: [
    'What if everything you knew about {niche} was wrong?',
    'Why do 99% of people fail at {niche}?',
    'What happens when you {action} every day for 30 days?',
    'Did you know this {niche} secret that experts won\'t tell you?',
    'Are you making this {niche} mistake right now?',
  ],
  [HookType.SHOCK]: [
    'This {niche} fact will change how you see the world',
    'The {niche} truth they don\'t want you to know',
    'I tried {niche} for 30 days — here\'s what happened',
    '{number} shocking {niche} facts that will blow your mind',
    'The dark side of {niche} no one talks about',
  ],
  [HookType.PROMISE]: [
    'How I went from zero to {result} with {niche} in {time}',
    'The only {niche} guide you\'ll ever need',
    'Do this one thing and {niche} will never be the same',
    'The fastest way to {result} using {niche}',
    '{result} guaranteed — the {niche} method that actually works',
  ],
  [HookType.STORY]: [
    'Nobody believed me when I said {niche} could do this',
    'I almost gave up on {niche} until I discovered this',
    'The moment that changed everything about {niche}',
    'How a {descriptor} person mastered {niche} in {time}',
    'This is how I got started in {niche} with nothing',
  ],
  [HookType.LIST]: [
    '{number} {niche} secrets the pros use',
    'Top {number} {niche} tips that actually work in {year}',
    '{number} reasons why {niche} is about to explode',
    'The {number} biggest {niche} mistakes (and how to fix them)',
    '{number} {niche} facts you won\'t believe are real',
  ],
  [HookType.HOW_TO]: [
    'How to start {niche} with zero experience',
    'How to {action} even if you\'re a complete beginner',
    'How this {descriptor} is making money with {niche}',
    'How to {result} using only {niche} — step by step',
    'How to get started in {niche} today (no experience needed)',
  ],
};

const NICHE_VARS: Record<string, Record<string, string>> = {
  history: {
    action: 'study ancient history',
    result: '$5,000/month',
    time: '90 days',
    descriptor: 'stay-at-home parent',
    number: '10',
    year: new Date().getFullYear().toString(),
  },
  finance: {
    action: 'invest $100',
    result: 'financial freedom',
    time: '1 year',
    descriptor: 'broke 22-year-old',
    number: '7',
    year: new Date().getFullYear().toString(),
  },
  science: {
    action: 'learn quantum physics',
    result: 'understand the universe',
    time: '6 months',
    descriptor: 'curious beginner',
    number: '5',
    year: new Date().getFullYear().toString(),
  },
  'true crime': {
    action: 'investigate cold cases',
    result: 'solve a mystery',
    time: '30 days',
    descriptor: 'amateur detective',
    number: '8',
    year: new Date().getFullYear().toString(),
  },
  motivation: {
    action: 'wake up at 5am',
    result: 'change your life',
    time: '21 days',
    descriptor: 'ordinary person',
    number: '5',
    year: new Date().getFullYear().toString(),
  },
  gaming: {
    action: 'play 8 hours a day',
    result: 'go pro',
    time: '6 months',
    descriptor: 'casual gamer',
    number: '10',
    year: new Date().getFullYear().toString(),
  },
  kids: {
    action: 'teach kids to code',
    result: 'raise a genius',
    time: '3 months',
    descriptor: 'non-technical parent',
    number: '6',
    year: new Date().getFullYear().toString(),
  },
};

const DEFAULT_VARS = {
  action: 'try this',
  result: 'massive results',
  time: '30 days',
  descriptor: 'regular person',
  number: '7',
  year: new Date().getFullYear().toString(),
};

@Injectable()
export class HooksService {
  constructor(@InjectModel(Hook.name) private hookModel: Model<HookDocument>) {}

  async findAll(): Promise<Hook[]> {
    return this.hookModel.find().sort({ viralPotential: -1 }).exec();
  }

  async findByNiche(niche: string): Promise<Hook[]> {
    return this.hookModel
      .find({ niche: { $regex: niche, $options: 'i' } })
      .sort({ viralPotential: -1 })
      .exec();
  }

  async findByType(type: string): Promise<Hook[]> {
    return this.hookModel.find({ type }).sort({ viralPotential: -1 }).exec();
  }

  async topHooks(limit = 10): Promise<Hook[]> {
    return this.hookModel.find().sort({ viralPotential: -1 }).limit(limit).exec();
  }

  async create(input: HookInput): Promise<Hook> {
    const hook = new this.hookModel(input);
    return hook.save();
  }

  async generateHooks(niche: string, count = 6): Promise<Hook[]> {
    const nicheKey = niche.toLowerCase();
    const vars = NICHE_VARS[nicheKey] || DEFAULT_VARS;
    const generated: Hook[] = [];
    const types = Object.values(HookType);

    // Generate one hook per type up to count
    for (let i = 0; i < Math.min(count, types.length); i++) {
      const type = types[i % types.length];
      const templates = HOOK_TEMPLATES[type];
      const template = templates[Math.floor(Math.random() * templates.length)];

      const text = template
        .replace(/\{niche\}/g, niche)
        .replace(/\{action\}/g, vars.action)
        .replace(/\{result\}/g, vars.result)
        .replace(/\{time\}/g, vars.time)
        .replace(/\{descriptor\}/g, vars.descriptor)
        .replace(/\{number\}/g, vars.number)
        .replace(/\{year\}/g, vars.year);

      // Calculate viral potential: base score + adjustments
      const viralPotential = this.scoreHook(text, type, niche);

      const hook = new this.hookModel({
        text,
        type,
        viralPotential,
        niche,
        category: this.getCategoryForNiche(niche),
        views: 0,
      });

      await hook.save();
      generated.push(hook);
    }

    return generated;
  }

  private scoreHook(text: string, type: string, niche: string): number {
    let score = 6; // base

    // Question and shock hooks tend to perform better
    if (type === HookType.QUESTION || type === HookType.SHOCK) score += 1;
    if (type === HookType.PROMISE) score += 0.5;

    // High-CPM niches get a bump
    const highCpmNiches = ['finance', 'business', 'technology', 'investing'];
    if (highCpmNiches.some((n) => niche.toLowerCase().includes(n))) score += 0.5;

    // Trending faceless niches
    const trendingNiches = ['history', 'true crime', 'motivation', 'science facts'];
    if (trendingNiches.some((n) => niche.toLowerCase().includes(n))) score += 0.3;

    // Cap at 10
    return Math.min(10, Math.round(score * 10) / 10);
  }

  private getCategoryForNiche(niche: string): string {
    const nicheKey = niche.toLowerCase();
    const categories: Record<string, string> = {
      history: 'History',
      science: 'Science',
      finance: 'Finance',
      'true crime': 'True Crime',
      motivation: 'Motivation',
      gaming: 'Gaming',
      kids: 'Kids',
      technology: 'Technology',
      business: 'Business',
    };
    for (const [key, category] of Object.entries(categories)) {
      if (nicheKey.includes(key)) return category;
    }
    return 'General';
  }
}
