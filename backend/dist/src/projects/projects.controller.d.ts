import { ProjectsService } from './projects.service';
import { Project } from '../entities/project.entity';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(projectData: Partial<Project>): Promise<Project>;
    findAll(): Promise<Project[]>;
    getStats(): Promise<any>;
    findOne(id: string): Promise<Project>;
    update(id: string, updateData: Partial<Project>): Promise<Project>;
    remove(id: string): Promise<void>;
    assignUser(projectId: string, userId: string): Promise<Project>;
    removeUser(projectId: string, userId: string): Promise<Project>;
}
