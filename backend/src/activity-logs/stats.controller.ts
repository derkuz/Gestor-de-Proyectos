import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Project } from '../entities/project.entity';
import { Ticket } from '../entities/ticket.entity';
import { Task } from '../entities/task.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { ActivityLogsService } from './activity-logs.service';

@Controller('admin/stats')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StatsController {
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Project) private readonly projectRepo: Repository<Project>,
        @InjectRepository(Ticket) private readonly ticketRepo: Repository<Ticket>,
        @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
        private readonly activityLogsService: ActivityLogsService,
    ) { }

    @Get()
    @Roles(UserRole.ADMIN)
    async getStats() {
        const [users, projects, tickets, tasks, technical] = await Promise.all([
            this.userRepo.count(),
            this.projectRepo.count(),
            this.ticketRepo.count(),
            this.taskRepo.count(),
            this.activityLogsService.getTechnicalMetrics()
        ]);

        return {
            users,
            projects,
            tickets,
            tasks,
            technical,
            lastUpdate: new Date()
        };
    }
}
