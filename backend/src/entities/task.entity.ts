import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Project } from './project.entity';
import { User } from './user.entity';
import { Ticket } from './ticket.entity';

export enum TaskPriority {
    BAJA = 'BAJA',
    MEDIA = 'MEDIA',
    ALTA = 'ALTA',
    CRITICA = 'CRITICA',
}

@Entity('task')
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

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

    @Column({ type: 'date', nullable: true })
    fechaInicio: Date;

    @Column({ type: 'date', nullable: true })
    fechaFin: Date;

    @ManyToOne(() => Project, (project) => project.tareas)
    proyecto: Project;

    @OneToOne(() => Ticket, ticket => ticket.tareaRelacionada, { nullable: true })
    ticketLigado: Ticket;

    // Hierarchy
    @ManyToOne(() => Task, (task) => task.subtareas, { nullable: true })
    @JoinColumn({ name: 'padreId' })
    padre: Task;

    @OneToMany(() => Task, (task) => task.padre)
    subtareas: Task[];

    @ManyToMany(() => User)
    @JoinTable({ name: 'task_assignments' })
    asignados: User[];
}
