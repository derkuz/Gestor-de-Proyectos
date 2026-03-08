import { Empresa } from './empresa.entity';
export declare class ActivityLog {
    id: string;
    accion: string;
    detalles: string;
    fecha: Date;
    entidadTipo: string;
    entidadId: string;
    duracionMs: number;
    categoria: string;
    empresa: Empresa;
    empresaId: string;
}
