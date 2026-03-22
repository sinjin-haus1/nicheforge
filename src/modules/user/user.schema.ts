import { Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@ObjectType()
export class UsageStats {
  @Field(() => Int) nicheSearches: number;
  @Field(() => Int) hookGenerations: number;
  @Field() resetAt: string;
}

@ObjectType()
@Schema({ timestamps: true })
export class User {
  @Field(() => ID, { nullable: true })
  id: string;

  @Field()
  @Prop({ required: true, unique: true })
  email: string;

  @Field({ nullable: true })
  @Prop()
  name?: string;

  @Field({ nullable: true })
  @Prop()
  image?: string;

  @Field()
  @Prop({ default: 'free', enum: ['free', 'pro', 'unlimited'] })
  plan: string;

  // Monthly usage counters
  @Prop({ default: 0 }) usageNicheSearches: number;
  @Prop({ default: 0 }) usageHookGenerations: number;
  @Prop({ default: () => new Date().toISOString() }) usageResetAt: string;

  @Field({ nullable: true })
  createdAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

// Plan limits
export const PLAN_LIMITS = {
  free:      { nicheSearches: 5,   hookGenerations: 10 },
  pro:       { nicheSearches: 50,  hookGenerations: 100 },
  unlimited: { nicheSearches: Infinity, hookGenerations: Infinity },
};
