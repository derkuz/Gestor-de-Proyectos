import { Project } from './project.entity';
export declare enum TaskPriority {
    BAJA = "BAJA",
    MEDIA = "MEDIA",
    ALTA = "ALTA",
    CRITICA = "CRITICA"
}
export declare class Task {
    id: string;
    nombre: string;
    prioridad: TaskPriority;
    estado: string;
    esSubtarea: boolean;
    proyecto: Project;
    padre: Task;
    subtareas: Task[];
}
