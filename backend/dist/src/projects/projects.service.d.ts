import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
export declare class ProjectsService {
    private projectsRepository;
    private activityLogsService;
    constructor(projectsRepository: Repository<Project>, activityLogsService: ActivityLogsService);
    create(projectData: Partial<Project>): Promise<Project>;
    findAll(): Promise<Project[]>;
    findOne(id: number): Promise<Project>;
    update(id: number, updateData: Partial<Project>): Promise<Project>;
    remove(id: number): Promise<void>;
    assignUser(projectId: number, userId: string): Promise<Project>;
    removeUser(projectId: number, userId: string): Promise<Project>;
    getStats(): Promise<any>;
}
