import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Task } from './task.entity';

@Entity()
export class Ticket {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 20 })
    codigo: string;

    @Column()
    titulo: string;

    @Column({ type: 'text' })
    mensaje: string;

    @Column({ default: 'Abierto' })
    estado: string;

    @OneToOne(() => Task, { nullable: true })
    @JoinColumn()
    tareaRelacionada: Task;
}
