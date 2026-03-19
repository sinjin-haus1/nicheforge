import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NicheDocument = Niche & Document;

@Schema({ timestamps: true })
export class Niche {
  @Prop({ required: true })
  name: string;

  @Prop()
  category: string;

  @Prop()
  description: string;

  @Prop()
  competition: string; // low, medium, high

  @Prop()
  trendScore: number; // 0-100

  @Prop()
  estimatedRevenue: string; // $, $$, $$$

  @Prop({ type: [String], default: [] })
  contentIdeas: string[];

  @Prop()
  difficulty: string; // beginner, intermediate, advanced

  @Prop()
  audienceSize: string; // small, medium, large

  @Prop()
  monetizationPotential: string; // low, medium, high
}

export const NicheSchema = SchemaFactory.createForClass(Niche);
