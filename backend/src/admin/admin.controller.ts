
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ProjectsService } from '../projects/projects.service';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class AdminController {
    constructor(
        private readonly projectsService: ProjectsService,
        private readonly activityLogsService: ActivityLogsService,
        private readonly usersService: UsersService
    ) { }

    @Get('stats')
    async getGlobalStats(@GetUser('empresaId') empresaId: string, @GetUser('rol') rol: string) {
        const stats = await this.projectsService.getStats(empresaId, rol === UserRole.SUPER_ADMIN);
        const technical = await this.activityLogsService.getTechnicalMetrics(empresaId);

        const usersCount = await this.usersService.count(empresaId, rol === UserRole.SUPER_ADMIN);

        return {
            ...stats,
            users: usersCount,
            technical,
            lastUpdate: new Date()
        };
    }
}
