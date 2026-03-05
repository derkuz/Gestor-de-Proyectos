import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';

@Injectable()
export class HttpLoggingMiddleware implements NestMiddleware {
    constructor(private activityLogsService: ActivityLogsService) { }

    use(req: Request, res: Response, next: NextFunction) {
        const start = Date.now();
        const { method, originalUrl } = req;

        res.on('finish', () => {
            const duration = Date.now() - start;
            const statusCode = res.statusCode;

            // Solo logueamos si no es una petición al mismo endpoint de logs para evitar bucles infinitos
            if (!originalUrl.includes('/activity-logs')) {
                const userId = (req as any).user?.id;
                this.activityLogsService.log(
                    'HTTP_REQUEST',
                    `[${method}] ${originalUrl} ${statusCode}`,
                    userId,
                    'HTTP',
                    undefined,
                    duration,
                    'TECHNICAL'
                ).catch(err => console.error('Error logging HTTP request:', err));
            }
        });

        next();
    }
}
