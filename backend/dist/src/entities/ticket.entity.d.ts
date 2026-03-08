import { Task } from './task.entity';
import { User } from './user.entity';
import { Category } from './category.entity';
import { Empresa } from './empresa.entity';
export declare class Ticket {
    id: string;
    codigo: string;
    titulo: string;
    categoria: string;
    categoriaRelacionada: Category;
    mensaje: string;
    imagenUrl: string;
    estado: string;
    respuestas: any;
    fechaCreacion: Date;
    tareaRelacionada: Task;
    usuario: User;
    empresa: Empresa;
    empresaId: string;
}
