import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
export declare class ProjectsService {
    private projectsRepository;
    constructor(projectsRepository: Repository<Project>);
    create(projectData: Partial<Project>): Promise<Project>;
    findAll(): Promise<Project[]>;
    findOne(id: string): Promise<Project>;
    update(id: string, updateData: Partial<Project>): Promise<Project>;
    remove(id: string): Promise<void>;
}
