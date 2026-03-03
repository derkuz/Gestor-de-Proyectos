import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Task } from './task.entity';
import { Documentation } from './documentation.entity';

export enum ProjectStatus {
    ACTIVO = 'ACTIVO',
    PAUSADO = 'PAUSADO',
    FINALIZADO = 'FINALIZADO',
}

@Entity()
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @Column({ type: 'jsonb', nullable: true })
    columnasKanban: any;

    @Column({
        type: 'enum',
        enum: ProjectStatus,
        default: ProjectStatus.ACTIVO,
    })
    estado: ProjectStatus;

    @CreateDateColumn()
    fechaCreacion: Date;

    @OneToMany(() => Task, (task) => task.proyecto)
    tareas: Task[];

    @OneToMany(() => Documentation, (doc) => doc.proyecto)
    documentos: Documentation[];
}
