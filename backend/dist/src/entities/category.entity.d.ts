import { User, UserRole } from './user.entity';
import { Ticket } from './ticket.entity';
import { Empresa } from './empresa.entity';
export declare class Category {
    id: string;
    nombre: string;
    descripcion: string;
    prefijo: string;
    rolesAutorizados: UserRole[];
    usuariosAutorizados: User[];
    tickets: Ticket[];
    empresa: Empresa;
    empresaId: string;
}
