import { DocumentationService } from './documentation.service';
export declare class DocumentationController {
    private readonly documentationService;
    constructor(documentationService: DocumentationService);
    findOne(projectId: string): Promise<import("../entities/documentation.entity").Documentation>;
    update(projectId: string, contenido: string): Promise<import("../entities/documentation.entity").Documentation>;
}
