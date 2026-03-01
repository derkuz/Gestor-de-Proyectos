import { Project } from './project.entity';
export declare class Documentation {
    id: string;
    contenido: string;
    ultimaActualizacion: Date;
    proyecto: Project;
}
