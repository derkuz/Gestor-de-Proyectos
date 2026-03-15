
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Project } from './project.entity';
import { Ticket } from './ticket.entity';
import { Category } from './category.entity';
import { ActivityLog } from './activity-log.entity';

@Entity('empresa')
export class Empresa {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column({ unique: true, nullable: true })
    cuit: string;

    @Column({ default: 'BASIC' })
    plan: string;

    @CreateDateColumn()
    fechaRegistro: Date;

    @Column({ default: true })
    activo: boolean;

    @OneToMany(() => User, (user) => user.empresa)
    usuarios: User[];

    @OneToMany(() => Project, (project) => project.empresa)
    proyectos: Project[];

    @OneToMany(() => Ticket, (ticket) => ticket.empresa)
    tickets: Ticket[];

    @OneToMany(() => Category, (category) => category.empresa)
    categorias: Category[];

    @OneToMany(() => ActivityLog, (log) => log.empresa)
    logs: ActivityLog[];
}
