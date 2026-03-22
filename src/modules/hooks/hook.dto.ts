import { Field, ID, ObjectType, Int, InputType, Float } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HookDocument = Hook & Document;

export enum HookType {
  QUESTION = 'question',
  SHOCK = 'shock',
  PROMISE = 'promise',
  STORY = 'story',
  LIST = 'list',
  HOW_TO = 'how-to',
}

@ObjectType()
@Schema({ timestamps: true })
export class Hook {
  @Field(() => ID, { nullable: true })
  id: string;

  @Field()
  @Prop({ required: true })
  text: string;

  @Field()
  @Prop({ required: true, enum: Object.values(HookType) })
  type: string;

  @Field(() => Int)
  @Prop({ default: 7 })
  viralPotential: number;

  @Field({ nullable: true })
  @Prop()
  niche?: string;

  @Field({ nullable: true })
  @Prop()
  category?: string;

  @Field(() => Int, { nullable: true })
  @Prop({ default: 0 })
  views?: number;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}

export const HookSchema = SchemaFactory.createForClass(Hook);

HookSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
HookSchema.set('toJSON', { virtuals: true });
HookSchema.set('toObject', { virtuals: true });

@InputType()
export class HookInput {
  @Field()
  text: string;

  @Field()
  type: string;

  @Field(() => Int, { nullable: true })
  viralPotential?: number;

  @Field({ nullable: true })
  niche?: string;

  @Field({ nullable: true })
  category?: string;
}

@ObjectType()
export class GeneratedHooks {
  @Field()
  niche: string;

  @Field(() => [Hook])
  hooks: Hook[];

  @Field(() => Int)
  count: number;
}
