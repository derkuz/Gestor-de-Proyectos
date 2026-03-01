import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';

export enum UserRole {
    ADMIN = 'ADMIN',
    PROJECT_MANAGER = 'PROJECT_MANAGER',
    COLABORADOR = 'COLABORADOR',
    EXTERNO = 'EXTERNO',
}

@Entity()
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
        type: 'enum',
        enum: UserRole,
        default: UserRole.COLABORADOR,
    })
    rol: UserRole;

    @CreateDateColumn()
    fechaRegistro: Date;
}
