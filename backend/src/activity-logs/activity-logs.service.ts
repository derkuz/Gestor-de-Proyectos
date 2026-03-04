import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from '../entities/activity-log.entity';

@Injectable()
export class ActivityLogsService {
    constructor(
        @InjectRepository(ActivityLog)
        private activityLogRepository: Repository<ActivityLog>,
    ) { }

    async log(accion: string, detalles: string, userId?: string, entidadTipo?: string, entidadId?: string) {
        const log = this.activityLogRepository.create({
            accion,
            detalles,
            usuario: userId ? { id: userId } as any : null,
            entidadTipo,
            entidadId,
        });
        return this.activityLogRepository.save(log);
    }

    async findAll(limit = 100) {
        return this.activityLogRepository.find({
            relations: ['usuario'],
            order: { fecha: 'DESC' },
            take: limit,
        });
    }
}
