import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToMany, ManyToOne } from 'typeorm';
import { Ticket } from './ticket.entity';
import { Project } from './project.entity';
import { Empresa } from './empresa.entity';

export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    ADMIN = 'ADMIN',
    PROJECT_MANAGER = 'PROJECT_MANAGER',
    COLABORADOR = 'COLABORADOR',
    EXTERNO = 'EXTERNO',
}

@Entity('user')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false }) // Hide password by default
    password: string;

    @Column()
    nombre: string;

    @Column({
        type: 'varchar',
        length: 20,
        default: UserRole.COLABORADOR,
    })
    rol: UserRole;

    @CreateDateColumn()
    fechaRegistro: Date;

    @Column({ nullable: true, select: false })
    resetToken: string;

    @Column({ nullable: true, select: false })
    resetTokenExpires: Date;

    @Column({ default: true })
    activo: boolean;

    @OneToMany(() => Ticket, (ticket) => ticket.usuario)
    tickets: Ticket[];

    @ManyToMany(() => Project, (project) => project.usuarios)
    proyectos: Project[];

    @ManyToOne(() => Empresa, (empresa) => empresa.usuarios)
    empresa: Empresa;

    @Column()
    empresaId: string;
}
