import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Project } from './project.entity';

export enum TaskPriority {
    BAJA = 'BAJA',
    MEDIA = 'MEDIA',
    ALTA = 'ALTA',
    CRITICA = 'CRITICA',
}

@Entity()
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column({
        type: 'enum',
        enum: TaskPriority,
        default: TaskPriority.MEDIA,
    })
    prioridad: TaskPriority;

    @Column({ default: 'Pendiente' })
    estado: string;

    @Column({ default: false })
    esSubtarea: boolean;

    @ManyToOne(() => Project, (project) => project.tareas)
    proyecto: Project;

    // Hierarchy
    @ManyToOne(() => Task, (task) => task.subtareas, { nullable: true })
    @JoinColumn({ name: 'padreId' })
    padre: Task;

    @OneToMany(() => Task, (task) => task.padre)
    subtareas: Task[];
}
