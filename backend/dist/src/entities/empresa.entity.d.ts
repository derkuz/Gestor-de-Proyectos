import { User } from './user.entity';
import { Project } from './project.entity';
import { Ticket } from './ticket.entity';
import { Category } from './category.entity';
import { ActivityLog } from './activity-log.entity';
export declare class Empresa {
    id: string;
    nombre: string;
    cuit: string;
    plan: string;
    fechaRegistro: Date;
    activo: boolean;
    usuarios: User[];
    proyectos: Project[];
    tickets: Ticket[];
    categorias: Category[];
    logs: ActivityLog[];
}
