import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
export declare class ProjectsService {
    private projectsRepository;
    private activityLogsService;
    constructor(projectsRepository: Repository<Project>, activityLogsService: ActivityLogsService);
    create(projectData: Partial<Project>, empresaId: string): Promise<Project>;
    findAll(empresaId: string, isSuperAdmin?: boolean): Promise<Project[]>;
    findOne(id: number, empresaId: string, isSuperAdmin?: boolean): Promise<Project>;
    update(id: number, updateData: Partial<Project>, empresaId: string): Promise<Project>;
    remove(id: number, empresaId: string): Promise<void>;
    assignUser(projectId: number, userId: string, empresaId: string): Promise<Project>;
    removeUser(projectId: number, userId: string, empresaId: string): Promise<Project>;
    getStats(empresaId: string, isSuperAdmin?: boolean): Promise<any>;
}
