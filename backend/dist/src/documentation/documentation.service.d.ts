import { Repository } from 'typeorm';
import { Documentation } from '../entities/documentation.entity';
import { Project } from '../entities/project.entity';
export declare class DocumentationService {
    private docRepository;
    private projectsRepository;
    constructor(docRepository: Repository<Documentation>, projectsRepository: Repository<Project>);
    findAllByProject(projectId: number, empresaId: string): Promise<Documentation[]>;
    findOne(id: string, empresaId: string): Promise<Documentation>;
    create(projectId: number, docData: Partial<Documentation>, empresaId: string): Promise<Documentation>;
    update(id: string, docData: Partial<Documentation>, empresaId: string): Promise<Documentation>;
    remove(id: string, empresaId: string): Promise<void>;
}
