import { User, UserRole } from './user.entity';
import { Ticket } from './ticket.entity';
export declare class Category {
    id: string;
    nombre: string;
    descripcion: string;
    prefijo: string;
    rolesAutorizados: UserRole[];
    usuariosAutorizados: User[];
    tickets: Ticket[];
}
