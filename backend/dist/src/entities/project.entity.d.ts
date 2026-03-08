import { Task } from './task.entity';
import { Documentation } from './documentation.entity';
import { User } from './user.entity';
import { Empresa } from './empresa.entity';
export declare enum ProjectStatus {
    ACTIVO = "ACTIVO",
    PAUSADO = "PAUSADO",
    FINALIZADO = "FINALIZADO"
}
export declare class Project {
    id: number;
    nombre: string;
    descripcion: string;
    columnasKanban: any;
    estado: ProjectStatus;
    fechaCreacion: Date;
    tareas: Task[];
    documentos: Documentation[];
    usuarios: User[];
    empresa: Empresa;
    empresaId: string;
}
