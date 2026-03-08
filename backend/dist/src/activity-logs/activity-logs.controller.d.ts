import { ActivityLogsService } from './activity-logs.service';
export declare class ActivityLogsController {
    private readonly activityLogsService;
    constructor(activityLogsService: ActivityLogsService);
    findAll(limit: number, empresaId: string, rol: string): Promise<import("../entities/activity-log.entity").ActivityLog[]>;
    purge(): Promise<{
        message: string;
        deletedCount: number;
    }>;
}
