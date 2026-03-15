import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Task } from './task.entity';
import { User } from './user.entity';
import { Category } from './category.entity';
import { Empresa } from './empresa.entity';

@Entity('ticket')
export class Ticket {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 20 })
    codigo: string;

    @Column()
    titulo: string;

    // We keep this temporarily for backward compatibility, but we'll prefer the relation.
    @Column({ default: 'Soporte General' })
    categoria: string;

    @ManyToOne(() => Category, (category) => category.tickets, { nullable: true })
    categoriaRelacionada: Category;

    @Column({ type: 'text' })
    mensaje: string;

    @Column({ nullable: true })
    imagenUrl: string;

    @Column({ default: 'ABIERTO' })
    estado: string;

    @Column({ type: 'jsonb', nullable: true, default: [] })
    respuestas: any;

    @CreateDateColumn()
    fechaCreacion: Date;

    @OneToOne(() => Task, { nullable: true })
    @JoinColumn()
    tareaRelacionada: Task;

    @ManyToOne(() => User, (user) => user.tickets)
    usuario: User;

    @ManyToOne(() => Empresa, (empresa) => empresa.tickets)
    empresa: Empresa;

    @Column()
    empresaId: string;
}
