import { Task } from './task.entity';
import { Documentation } from './documentation.entity';
export declare enum ProjectStatus {
    ACTIVO = "ACTIVO",
    PAUSADO = "PAUSADO",
    FINALIZADO = "FINALIZADO"
}
export declare class Project {
    id: string;
    nombre: string;
    descripcion: string;
    estado: ProjectStatus;
    fechaCreacion: Date;
    tareas: Task[];
    documentacion: Documentation;
}
