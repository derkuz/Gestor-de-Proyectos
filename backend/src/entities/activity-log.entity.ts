import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class ActivityLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    accion: string; // Ejemplo: 'LOGIN', 'CREATE_PROJECT', 'UPDATE_TASK'

    @Column({ type: 'text', nullable: true })
    detalles: string; // Información adicional en JSON o texto plano

    @CreateDateColumn()
    fecha: Date;

    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    usuario: User;

    @Column({ nullable: true })
    entidadTipo: string; // 'PROJECT', 'TASK', 'TICKET', etc.

    @Column({ nullable: true })
    entidadId: string;

    @Column({ type: 'int', nullable: true })
    duracionMs: number;

    @Column({ default: 'BUSINESS' })
    categoria: string; // 'BUSINESS' o 'TECHNICAL'
}
