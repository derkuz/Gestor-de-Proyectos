import { Repository } from 'typeorm';
import { Documentation } from '../entities/documentation.entity';
import { Project } from '../entities/project.entity';
export declare class DocumentationService {
    private docRepository;
    private projectsRepository;
    constructor(docRepository: Repository<Documentation>, projectsRepository: Repository<Project>);
    findAllByProject(projectId: string): Promise<Documentation[]>;
    findOne(id: string): Promise<Documentation>;
    create(projectId: string, docData: Partial<Documentation>): Promise<Documentation>;
    update(id: string, docData: Partial<Documentation>): Promise<Documentation>;
    remove(id: string): Promise<void>;
}
