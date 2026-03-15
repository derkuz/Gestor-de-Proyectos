import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from '../entities/activity-log.entity';

@Injectable()
export class ActivityLogsService {
    constructor(
        @InjectRepository(ActivityLog)
        private activityLogRepository: Repository<ActivityLog>,
    ) {
        // Intentar limpiar al arrancar
        this.purgeOldLogs().catch(console.error);
    }

    async log(accion: string, detalles: string, userId?: string, entidadTipo?: string, entidadId?: string, empresaId?: string, duracionMs?: number, categoria = 'BUSINESS') {
        const log = this.activityLogRepository.create({
            accion,
            detalles,
            entidadTipo,
            entidadId,
            empresa: empresaId ? { id: empresaId } as any : undefined,
            usuario: userId ? { id: userId } as any : undefined,
            duracionMs,
            categoria
        });
        return this.activityLogRepository.save(log);
    }

    async getTechnicalMetrics(empresaId: string, isSuperAdmin: boolean = false) {
        // ... (existing purge logic)
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

        // Borramos solo logs técnicos de más de 14 días para no llenar el disco
        const result = await this.activityLogRepository
            .createQueryBuilder()
            .delete()
            .where('categoria = :categoria', { categoria: 'TECHNICAL' })
            .andWhere('fecha < :fourteenDaysAgo', { fourteenDaysAgo })
            .execute();

        return result.affected || 0;
    }

    async findAll(empresaId: string, limit = 100, isSuperAdmin: boolean = false) {
        const where = (isSuperAdmin || !empresaId) ? {} : { empresa: { id: empresaId } };
        return this.activityLogRepository.find({
            where: where as any,
            relations: ['usuario'],
            order: { fecha: 'DESC' },
            take: limit,
        });
    }
}
