import { Repository } from 'typeorm';
import { ActivityLog } from '../entities/activity-log.entity';
export declare class ActivityLogsService {
    private activityLogRepository;
    constructor(activityLogRepository: Repository<ActivityLog>);
    log(accion: string, detalles: string, userId?: string, entidadTipo?: string, entidadId?: string, empresaId?: string, duracionMs?: number, categoria?: string): Promise<ActivityLog>;
    getTechnicalMetrics(empresaId: string, isSuperAdmin?: boolean): Promise<{
        avgResponseTime: number;
        totalRequests: number;
        timeline: any[];
    }>;
    purgeOldLogs(): Promise<number>;
    findAll(empresaId: string, limit?: number, isSuperAdmin?: boolean): Promise<ActivityLog[]>;
}
