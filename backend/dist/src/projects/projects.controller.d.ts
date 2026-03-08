import { ProjectsService } from './projects.service';
import { Project } from '../entities/project.entity';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(projectData: Partial<Project>, empresaId: string): Promise<Project>;
    findAll(empresaId: string): Promise<Project[]>;
    getStats(empresaId: string): Promise<any>;
    findOne(id: string, empresaId: string): Promise<Project>;
    update(id: string, updateData: Partial<Project>, empresaId: string): Promise<Project>;
    remove(id: string, empresaId: string): Promise<void>;
    assignUser(projectId: string, userId: string, empresaId: string): Promise<Project>;
    removeUser(projectId: string, userId: string, empresaId: string): Promise<Project>;
}
