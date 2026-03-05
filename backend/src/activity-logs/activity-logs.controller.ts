import { Controller, Get, Post, UseGuards, Query } from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('activity-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ActivityLogsController {
    constructor(private readonly activityLogsService: ActivityLogsService) { }

    @Get()
    @Roles(UserRole.ADMIN)
    findAll(@Query('limit') limit?: number) {
        return this.activityLogsService.findAll(limit ? Number(limit) : 50);
    }

    @Post('purge')
    @Roles(UserRole.ADMIN)
    async purge() {
        const deletedCount = await this.activityLogsService.purgeOldLogs();
        return { message: 'Logs técnicos depurados', deletedCount };
    }
}
