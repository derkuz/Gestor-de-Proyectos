import { User } from './user.entity';
export declare class ActivityLog {
    id: string;
    accion: string;
    detalles: string;
    fecha: Date;
    usuario: User;
    entidadTipo: string;
    entidadId: string;
    duracionMs: number;
    categoria: string;
}
