import { Ticket } from './ticket.entity';
import { Project } from './project.entity';
export declare enum UserRole {
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
}
