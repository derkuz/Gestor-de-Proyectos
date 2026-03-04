import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Project } from '../entities/project.entity';
import { Ticket } from '../entities/ticket.entity';
import { Task } from '../entities/task.entity';
export declare class StatsController {
    private readonly userRepo;
    private readonly projectRepo;
    private readonly ticketRepo;
    private readonly taskRepo;
    constructor(userRepo: Repository<User>, projectRepo: Repository<Project>, ticketRepo: Repository<Ticket>, taskRepo: Repository<Task>);
    getStats(): Promise<{
        users: number;
        projects: number;
        tickets: number;
        tasks: number;
        lastUpdate: Date;
    }>;
}
