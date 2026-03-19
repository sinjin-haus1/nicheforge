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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NicheResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const niche_service_1 = require("./niche.service");
const niche_dto_1 = require("./niche.dto");
let NicheResolver = class NicheResolver {
    constructor(nicheService) {
        this.nicheService = nicheService;
    }
    async niches() {
        return this.nicheService.findAll();
    }
    async niche(id) {
        return this.nicheService.findOne(id);
    }
    async searchNiches(keyword) {
        return this.nicheService.search(keyword);
    }
    async nichesByCategory(category) {
        return this.nicheService.findByCategory(category);
    }
    async trendingFaceless() {
        return this.nicheService.getTrendingForFaceless();
    }
    async analyzeCompetition(nicheId) {
        return this.nicheService.analyzeCompetition(nicheId);
    }
    async estimateRevenue(nicheId) {
        return this.nicheService.estimateRevenue(nicheId);
    }
    async createNiche(input) {
        return this.nicheService.create(input);
    }
};
exports.NicheResolver = NicheResolver;
__decorate([
    (0, graphql_1.Query)(() => [niche_dto_1.Niche]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NicheResolver.prototype, "niches", null);
__decorate([
    (0, graphql_1.Query)(() => niche_dto_1.Niche, { nullable: true }),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NicheResolver.prototype, "niche", null);
__decorate([
    (0, graphql_1.Query)(() => [niche_dto_1.Niche]),
    __param(0, (0, graphql_1.Args)('keyword')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NicheResolver.prototype, "searchNiches", null);
__decorate([
    (0, graphql_1.Query)(() => [niche_dto_1.Niche]),
    __param(0, (0, graphql_1.Args)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NicheResolver.prototype, "nichesByCategory", null);
__decorate([
    (0, graphql_1.Query)(() => [niche_dto_1.Niche]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NicheResolver.prototype, "trendingFaceless", null);
__decorate([
    (0, graphql_1.Query)(() => niche_dto_1.CompetitionAnalysis),
    __param(0, (0, graphql_1.Args)('nicheId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NicheResolver.prototype, "analyzeCompetition", null);
__decorate([
    (0, graphql_1.Query)(() => niche_dto_1.RevenueEstimate),
    __param(0, (0, graphql_1.Args)('nicheId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NicheResolver.prototype, "estimateRevenue", null);
__decorate([
    (0, graphql_1.Mutation)(() => niche_dto_1.Niche),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [niche_dto_1.NicheInput]),
    __metadata("design:returntype", Promise)
], NicheResolver.prototype, "createNiche", null);
exports.NicheResolver = NicheResolver = __decorate([
    (0, graphql_1.Resolver)(() => niche_dto_1.Niche),
    __metadata("design:paramtypes", [niche_service_1.NicheService])
], NicheResolver);
//# sourceMappingURL=niche.resolver.js.map