import { Project } from './project.entity';
export declare enum DocType {
    MD = "MD",
    LINK = "LINK",
    FILE = "FILE"
}
export declare class Documentation {
    id: string;
    titulo: string;
    tipo: DocType;
    url: string;
    ultimaActualizacion: Date;
    proyecto: Project;
}
