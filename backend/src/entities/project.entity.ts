import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { Task } from './task.entity';
import { Documentation } from './documentation.entity';
import { User } from './user.entity';
import { Empresa } from './empresa.entity';

export enum ProjectStatus {
    ACTIVO = 'ACTIVO',
    PAUSADO = 'PAUSADO',
    FINALIZADO = 'FINALIZADO',
}

@Entity('project')
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

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

    @ManyToMany(() => User, (user) => user.proyectos)
    @JoinTable({ name: 'project_users' })
    usuarios: User[];

    @ManyToOne(() => Empresa, (empresa) => empresa.proyectos)
    empresa: Empresa;

    @Column({ nullable: true })
    empresaId: string;
}
