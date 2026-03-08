import { Ticket } from './ticket.entity';
import { Project } from './project.entity';
import { Empresa } from './empresa.entity';
export declare enum UserRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    PROJECT_MANAGER = "PROJECT_MANAGER",
    COLABORADOR = "COLABORADOR",
    EXTERNO = "EXTERNO"
}
export declare class User {
    id: string;
    email: string;
    password: string;
    nombre: string;
    rol: UserRole;
    fechaRegistro: Date;
    resetToken: string;
    resetTokenExpires: Date;
    activo: boolean;
    tickets: Ticket[];
    proyectos: Project[];
    empresa: Empresa;
    empresaId: string;
}
