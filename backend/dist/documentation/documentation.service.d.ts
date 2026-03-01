import { Repository } from 'typeorm';
import { Documentation } from '../entities/documentation.entity';
import { Project } from '../entities/project.entity';
export declare class DocumentationService {
    private docRepository;
    private projectsRepository;
    constructor(docRepository: Repository<Documentation>, projectsRepository: Repository<Project>);
    findByProjectId(projectId: string): Promise<Documentation>;
    updateByProjectId(projectId: string, contenido: string): Promise<Documentation>;
}
