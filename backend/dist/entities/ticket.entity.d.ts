import { Task } from './task.entity';
export declare class Ticket {
    id: string;
    codigo: string;
    titulo: string;
    mensaje: string;
    estado: string;
    tareaRelacionada: Task;
}
