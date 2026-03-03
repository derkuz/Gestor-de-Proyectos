import { User } from './user.entity';
import { Ticket } from './ticket.entity';
export declare class Category {
    id: string;
    nombre: string;
    descripcion: string;
    prefijo: string;
    usuariosAutorizados: User[];
    tickets: Ticket[];
}
