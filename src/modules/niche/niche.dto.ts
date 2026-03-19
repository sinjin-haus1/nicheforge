import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';

@ObjectType()
export class Niche {
  @Field(() => ID)
  _id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  category?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  competition?: string;

  @Field({ nullable: true })
  trendScore?: number;

  @Field({ nullable: true })
  estimatedRevenue?: string;

  @Field(() => [String], { nullable: true })
  contentIdeas?: string[];

  @Field({ nullable: true })
  difficulty?: string;

  @Field({ nullable: true })
  audienceSize?: string;

  @Field({ nullable: true })
  monetizationPotential?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@InputType()
export class NicheInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  category?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  competition?: string;

  @Field({ nullable: true })
  trendScore?: number;

  @Field({ nullable: true })
  estimatedRevenue?: string;

  @Field(() => [String], { nullable: true })
  contentIdeas?: string[];

  @Field({ nullable: true })
  difficulty?: string;

  @Field({ nullable: true })
  audienceSize?: string;

  @Field({ nullable: true })
  monetizationPotential?: string;
}
