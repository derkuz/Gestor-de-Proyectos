import { Controller, Get, Post, UseGuards, Query } from '@nestjs/common';
import { GetUser } from '../auth/decorators/get-user.decorator';
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
    @Roles(UserRole.SUPER_ADMIN)
    findAll(
        @Query('limit') limit: number,
        @GetUser('empresaId') empresaId: string,
        @GetUser('rol') rol: string
    ) {
        return this.activityLogsService.findAll(empresaId, limit ? Number(limit) : 50, rol === UserRole.SUPER_ADMIN);
    }

    @Post('purge')
    @Roles(UserRole.SUPER_ADMIN)
    async purge() {
        const deletedCount = await this.activityLogsService.purgeOldLogs();
        return { message: 'Logs técnicos depurados', deletedCount };
    }
}
