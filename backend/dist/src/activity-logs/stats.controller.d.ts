import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Project } from '../entities/project.entity';
import { Ticket } from '../entities/ticket.entity';
import { Task } from '../entities/task.entity';
import { ActivityLogsService } from './activity-logs.service';
export declare class StatsController {
    private readonly userRepo;
    private readonly projectRepo;
    private readonly ticketRepo;
    private readonly taskRepo;
    private readonly activityLogsService;
    constructor(userRepo: Repository<User>, projectRepo: Repository<Project>, ticketRepo: Repository<Ticket>, taskRepo: Repository<Task>, activityLogsService: ActivityLogsService);
    getStats(): Promise<{
        users: number;
        projects: number;
        tickets: number;
        tasks: number;
        technical: {
            avgResponseTime: number;
            totalRequests: number;
            timeline: any[];
        };
        lastUpdate: Date;
    }>;
}
