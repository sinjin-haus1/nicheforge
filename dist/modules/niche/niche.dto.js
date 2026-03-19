"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevenueEstimate = exports.CompetitionAnalysis = exports.NicheInput = exports.NicheSchema = exports.Niche = void 0;
const graphql_1 = require("@nestjs/graphql");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("@nestjs/mongoose");
let Niche = class Niche {
};
exports.Niche = Niche;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], Niche.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Niche.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Niche.prototype, "category", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Niche.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Niche.prototype, "competition", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Niche.prototype, "trendScore", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Niche.prototype, "estimatedRevenue", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Niche.prototype, "contentIdeas", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Niche.prototype, "difficulty", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Niche.prototype, "audienceSize", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Niche.prototype, "monetizationPotential", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], Niche.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], Niche.prototype, "updatedAt", void 0);
exports.Niche = Niche = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, mongoose_2.Schema)({ timestamps: true })
], Niche);
exports.NicheSchema = mongoose_2.SchemaFactory.createForClass(Niche);
exports.NicheSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
exports.NicheSchema.set('toJSON', { virtuals: true });
exports.NicheSchema.set('toObject', { virtuals: true });
let NicheInput = class NicheInput {
};
exports.NicheInput = NicheInput;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], NicheInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], NicheInput.prototype, "category", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], NicheInput.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], NicheInput.prototype, "competition", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], NicheInput.prototype, "trendScore", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], NicheInput.prototype, "estimatedRevenue", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], NicheInput.prototype, "contentIdeas", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], NicheInput.prototype, "difficulty", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], NicheInput.prototype, "audienceSize", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], NicheInput.prototype, "monetizationPotential", void 0);
exports.NicheInput = NicheInput = __decorate([
    (0, graphql_1.InputType)()
], NicheInput);
let CompetitionAnalysis = class CompetitionAnalysis {
};
exports.CompetitionAnalysis = CompetitionAnalysis;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], CompetitionAnalysis.prototype, "nicheId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CompetitionAnalysis.prototype, "nicheName", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CompetitionAnalysis.prototype, "competitionLevel", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], CompetitionAnalysis.prototype, "competitorCount", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], CompetitionAnalysis.prototype, "avgChannelAge", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], CompetitionAnalysis.prototype, "avgSubscribers", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CompetitionAnalysis.prototype, "saturationLevel", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], CompetitionAnalysis.prototype, "opportunityScore", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], CompetitionAnalysis.prototype, "recommendations", void 0);
exports.CompetitionAnalysis = CompetitionAnalysis = __decorate([
    (0, graphql_1.ObjectType)()
], CompetitionAnalysis);
let RevenueEstimate = class RevenueEstimate {
};
exports.RevenueEstimate = RevenueEstimate;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], RevenueEstimate.prototype, "nicheId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], RevenueEstimate.prototype, "nicheName", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], RevenueEstimate.prototype, "estimatedMonthlyViews", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], RevenueEstimate.prototype, "estimatedCPM", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], RevenueEstimate.prototype, "estimatedMonthlyRevenue", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], RevenueEstimate.prototype, "revenueRange", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], RevenueEstimate.prototype, "monetizationMethods", void 0);
exports.RevenueEstimate = RevenueEstimate = __decorate([
    (0, graphql_1.ObjectType)()
], RevenueEstimate);
//# sourceMappingURL=niche.dto.js.map