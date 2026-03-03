import { DocumentationService } from './documentation.service';
import { Documentation } from '../entities/documentation.entity';
export declare class DocumentationController {
    private readonly documentationService;
    constructor(documentationService: DocumentationService);
    findAll(projectId: string): Promise<Documentation[]>;
    uploadFile(projectId: string, file: Express.Multer.File, titulo: string): Promise<Documentation>;
    findOne(id: string): Promise<Documentation>;
    create(projectId: string, docData: Partial<Documentation>): Promise<Documentation>;
    update(id: string, docData: Partial<Documentation>): Promise<Documentation>;
    remove(id: string): Promise<void>;
}
