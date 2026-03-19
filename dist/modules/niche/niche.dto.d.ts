import { Document, Types } from 'mongoose';
export type NicheDocument = Niche & Document;
export declare class Niche {
    id: string;
    name: string;
    category?: string;
    description?: string;
    competition?: string;
    trendScore?: number;
    estimatedRevenue?: string;
    contentIdeas?: string[];
    difficulty?: string;
    audienceSize?: string;
    monetizationPotential?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const NicheSchema: import("mongoose").Schema<Niche, import("mongoose").Model<Niche, any, any, any, Document<unknown, any, Niche, any, {}> & Niche & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Niche, Document<unknown, {}, import("mongoose").FlatRecord<Niche>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Niche> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class NicheInput {
    name?: string;
    category?: string;
    description?: string;
    competition?: string;
    trendScore?: number;
    estimatedRevenue?: string;
    contentIdeas?: string[];
    difficulty?: string;
    audienceSize?: string;
    monetizationPotential?: string;
}
export declare class CompetitionAnalysis {
    nicheId: string;
    nicheName: string;
    competitionLevel: string;
    competitorCount: number;
    avgChannelAge: number;
    avgSubscribers: number;
    saturationLevel: string;
    opportunityScore: number;
    recommendations: string[];
}
export declare class RevenueEstimate {
    nicheId: string;
    nicheName: string;
    estimatedMonthlyViews: string;
    estimatedCPM: string;
    estimatedMonthlyRevenue: string;
    revenueRange: string;
    monetizationMethods: string[];
}
