import { Project } from './project.entity';
import { User } from './user.entity';
import { Ticket } from './ticket.entity';
export declare enum TaskPriority {
    BAJA = "BAJA",
    MEDIA = "MEDIA",
    ALTA = "ALTA",
    CRITICA = "CRITICA"
}
export declare class Task {
    id: string;
    nombre: string;
    descripcion: string;
    prioridad: TaskPriority;
    estado: string;
    esSubtarea: boolean;
    fechaInicio: Date;
    fechaFin: Date;
    proyecto: Project;
    ticketLigado: Ticket;
    padre: Task;
    subtareas: Task[];
    asignados: User[];
}
