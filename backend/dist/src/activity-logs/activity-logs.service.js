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
exports.ActivityLogsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const activity_log_entity_1 = require("../entities/activity-log.entity");
let ActivityLogsService = class ActivityLogsService {
    activityLogRepository;
    constructor(activityLogRepository) {
        this.activityLogRepository = activityLogRepository;
        this.purgeOldLogs().catch(console.error);
    }
    async log(accion, detalles, userId, entidadTipo, entidadId, empresaId, duracionMs, categoria = 'BUSINESS') {
        const log = this.activityLogRepository.create({
            accion,
            detalles,
            entidadTipo,
            entidadId,
            empresaId,
            duracionMs,
            categoria
        });
        return this.activityLogRepository.save(log);
    }
    async getTechnicalMetrics(empresaId, isSuperAdmin = false) {
        this.purgeOldLogs().catch(console.error);
        const yesterday = new Date();
        yesterday.setHours(yesterday.getHours() - 24);
        const metricsQuery = this.activityLogRepository
            .createQueryBuilder('log')
            .select('AVG(log.duracionMs)', 'avgResponseTime')
            .addSelect('COUNT(*)', 'totalRequests')
            .where('log.categoria = :categoria', { categoria: 'TECHNICAL' })
            .andWhere('log.fecha > :yesterday', { yesterday });
        if (!isSuperAdmin) {
            metricsQuery.andWhere('log.empresaId = :empresaId', { empresaId });
        }
        const metrics = await metricsQuery.getRawOne();
        const timelineQuery = this.activityLogRepository
            .createQueryBuilder('log')
            .select("DATE_TRUNC('hour', log.fecha)", 'hour')
            .addSelect('AVG(log.duracionMs)', 'avgResponseTime')
            .addSelect('COUNT(*)', 'requestCount')
            .where('log.categoria = :categoria', { categoria: 'TECHNICAL' })
            .andWhere('log.fecha > :yesterday', { yesterday });
        if (!isSuperAdmin) {
            timelineQuery.andWhere('log.empresaId = :empresaId', { empresaId });
        }
        const timeline = await timelineQuery
            .groupBy("DATE_TRUNC('hour', log.fecha)")
            .orderBy('hour', 'ASC')
            .getRawMany();
        return {
            avgResponseTime: Math.round(metrics.avgResponseTime || 0),
            totalRequests: parseInt(metrics.totalRequests || 0),
            timeline
        };
    }
    async purgeOldLogs() {
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
        const result = await this.activityLogRepository
            .createQueryBuilder()
            .delete()
            .where('categoria = :categoria', { categoria: 'TECHNICAL' })
            .andWhere('fecha < :fourteenDaysAgo', { fourteenDaysAgo })
            .execute();
        return result.affected || 0;
    }
    async findAll(empresaId, limit = 100, isSuperAdmin = false) {
        const where = isSuperAdmin ? {} : { empresaId };
        return this.activityLogRepository.find({
            where,
            relations: ['usuario'],
            order: { fecha: 'DESC' },
            take: limit,
        });
    }
};
exports.ActivityLogsService = ActivityLogsService;
exports.ActivityLogsService = ActivityLogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(activity_log_entity_1.ActivityLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ActivityLogsService);
//# sourceMappingURL=activity-logs.service.js.map