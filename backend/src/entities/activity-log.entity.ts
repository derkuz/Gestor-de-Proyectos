
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Empresa } from './empresa.entity';

@Entity('activity_log')
export class ActivityLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    accion: string;

    @Column({ name: 'detalle', type: 'text', nullable: true })
    detalles: string;

    @CreateDateColumn()
    fecha: Date;

    @Column({ name: 'tipo', nullable: true })
    entidadTipo: string;

    @Column({ nullable: true })
    entidadId: string;

    @Column({ name: 'duracionms', type: 'int', nullable: true })
    duracionMs: number;

    @Column({ name: 'categoria', default: 'BUSINESS' })
    categoria: string;

    @ManyToOne(() => Empresa)
    @JoinColumn({ name: 'empresaId' })
    empresa: Empresa;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    usuario: User;
}
