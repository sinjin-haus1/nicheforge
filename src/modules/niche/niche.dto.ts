import { Field, ID, ObjectType, Int, InputType } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NicheDocument = Niche & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Niche {
  @Field(() => ID, { nullable: true })
  id: string;

  @Field({ nullable: true })
  @Prop({ required: true })
  name: string;

  @Field({ nullable: true })
  @Prop()
  category?: string;

  @Field({ nullable: true })
  @Prop()
  description?: string;

  @Field({ nullable: true })
  @Prop()
  competition?: string;

  @Field(() => Int, { nullable: true })
  @Prop()
  trendScore?: number;

  @Field({ nullable: true })
  @Prop()
  estimatedRevenue?: string;

  @Field(() => [String], { nullable: true })
  @Prop({ type: [String], default: [] })
  contentIdeas?: string[];

  @Field({ nullable: true })
  @Prop()
  difficulty?: string;

  @Field({ nullable: true })
  @Prop()
  audienceSize?: string;

  @Field({ nullable: true })
  @Prop()
  monetizationPotential?: string;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}

export const NicheSchema = SchemaFactory.createForClass(Niche);

// Add virtual id
NicheSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

NicheSchema.set('toJSON', { virtuals: true });
NicheSchema.set('toObject', { virtuals: true });

@InputType()
export class NicheInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  category?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  competition?: string;

  @Field(() => Int, { nullable: true })
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

@ObjectType()
export class CompetitionAnalysis {
  @Field(() => ID)
  nicheId: string;

  @Field()
  nicheName: string;

  @Field()
  competitionLevel: string;

  @Field(() => Int)
  competitorCount: number;

  @Field(() => Int)
  avgChannelAge: number;

  @Field(() => Int)
  avgSubscribers: number;

  @Field()
  saturationLevel: string;

  @Field()
  opportunityScore: number;

  @Field(() => [String])
  recommendations: string[];
}

@ObjectType()
export class RevenueEstimate {
  @Field(() => ID)
  nicheId: string;

  @Field()
  nicheName: string;

  @Field()
  estimatedMonthlyViews: string;

  @Field()
  estimatedCPM: string;

  @Field()
  estimatedMonthlyRevenue: string;

  @Field()
  revenueRange: string;

  @Field(() => [String])
  monetizationMethods: string[];
}
