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
exports.NicheService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const niche_dto_1 = require("./niche.dto");
let NicheService = class NicheService {
    constructor(nicheModel) {
        this.nicheModel = nicheModel;
    }
    async findAll() {
        return this.nicheModel.find().sort({ trendScore: -1 }).exec();
    }
    async findOne(id) {
        return this.nicheModel.findById(id).exec();
    }
    async search(keyword) {
        return this.nicheModel.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { category: { $regex: keyword, $options: 'i' } },
            ],
        }).exec();
    }
    async findByCategory(category) {
        return this.nicheModel.find({ category }).sort({ trendScore: -1 }).exec();
    }
    async create(input) {
        const niche = new this.nicheModel(input);
        return niche.save();
    }
    async getTrendingForFaceless() {
        return this.nicheModel.find({
            $or: [
                { category: 'History' },
                { category: 'Science' },
                { category: 'Facts' },
                { category: 'True Crime' },
                { category: 'Motivation' },
                { category: 'Kids' },
                { category: 'Gaming' },
            ],
        }).sort({ trendScore: -1 }).limit(10).exec();
    }
    async analyzeCompetition(nicheId) {
        const niche = await this.nicheModel.findById(nicheId).exec();
        if (!niche) {
            throw new Error('Niche not found');
        }
        const competitionLevel = niche.competition || 'medium';
        const trendScore = niche.trendScore || 50;
        let opportunityScore = 50;
        if (competitionLevel === 'low')
            opportunityScore += 25;
        else if (competitionLevel === 'high')
            opportunityScore -= 20;
        if (trendScore > 70)
            opportunityScore += 15;
        else if (trendScore < 40)
            opportunityScore -= 10;
        const recommendations = [];
        if (opportunityScore > 70) {
            recommendations.push('Excellent opportunity - low competition with high trend');
        }
        else if (opportunityScore > 50) {
            recommendations.push('Good opportunity - consider this niche for entry');
        }
        else {
            recommendations.push('High competition - need unique angle to succeed');
        }
        if (niche.category === 'History') {
            recommendations.push('Consider documentary-style narration');
        }
        else if (niche.category === 'Science') {
            recommendations.push('Use animated visuals for better engagement');
        }
        return {
            nicheId: niche._id,
            nicheName: niche.name,
            competitionLevel,
            competitorCount: competitionLevel === 'low' ? 50 : competitionLevel === 'medium' ? 200 : 500,
            avgChannelAge: competitionLevel === 'low' ? 6 : competitionLevel === 'medium' ? 18 : 36,
            avgSubscribers: competitionLevel === 'low' ? 5000 : competitionLevel === 'medium' ? 25000 : 100000,
            saturationLevel: competitionLevel === 'low' ? 'Low' : competitionLevel === 'medium' ? 'Medium' : 'High',
            opportunityScore: Math.min(100, Math.max(0, opportunityScore)),
            recommendations,
        };
    }
    async estimateRevenue(nicheId) {
        const niche = await this.nicheModel.findById(nicheId).exec();
        if (!niche) {
            throw new Error('Niche not found');
        }
        const monetizationPotential = niche.monetizationPotential || 'medium';
        const trendScore = niche.trendScore || 50;
        let estimatedMonthlyViews = '100K-500K';
        if (trendScore > 70)
            estimatedMonthlyViews = '500K-1M';
        else if (trendScore > 50)
            estimatedMonthlyViews = '200K-800K';
        else if (trendScore < 30)
            estimatedMonthlyViews = '10K-100K';
        let estimatedCPM = '$3-$8';
        if (niche.category === 'Finance' || niche.category === 'Business') {
            estimatedCPM = '$8-$20';
        }
        else if (niche.category === 'Technology') {
            estimatedCPM = '$5-$12';
        }
        else if (niche.category === 'Kids') {
            estimatedCPM = '$2-$5';
        }
        let estimatedMonthlyRevenue = '$300-$2,000';
        if (monetizationPotential === 'high') {
            estimatedMonthlyRevenue = trendScore > 70 ? '$2,000-$10,000' : '$1,000-$5,000';
        }
        else if (monetizationPotential === 'medium') {
            estimatedMonthlyRevenue = trendScore > 70 ? '$500-$3,000' : '$200-$1,500';
        }
        else {
            estimatedMonthlyRevenue = '$50-$500';
        }
        const revenueRange = estimatedMonthlyRevenue;
        const monetizationMethods = ['AdSense', 'Sponsorships', 'Affiliate Marketing', 'Merchandise'];
        return {
            nicheId: niche._id,
            nicheName: niche.name,
            estimatedMonthlyViews,
            estimatedCPM,
            estimatedMonthlyRevenue,
            revenueRange,
            monetizationMethods,
        };
    }
};
exports.NicheService = NicheService;
exports.NicheService = NicheService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(niche_dto_1.Niche.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], NicheService);
//# sourceMappingURL=niche.service.js.map