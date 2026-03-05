import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
export declare class HttpLoggingMiddleware implements NestMiddleware {
    private activityLogsService;
    constructor(activityLogsService: ActivityLogsService);
    use(req: Request, res: Response, next: NextFunction): void;
}
