import { Repository } from 'typeorm';
import { ActivityLog } from '../entities/activity-log.entity';
export declare class ActivityLogsService {
    private activityLogRepository;
    constructor(activityLogRepository: Repository<ActivityLog>);
    log(accion: string, detalles: string, userId?: string, entidadTipo?: string, entidadId?: string, duracionMs?: number, categoria?: string): Promise<ActivityLog>;
    getTechnicalMetrics(): Promise<{
        avgResponseTime: number;
        totalRequests: number;
        timeline: any[];
    }>;
    purgeOldLogs(): Promise<number>;
    findAll(limit?: number): Promise<ActivityLog[]>;
}
