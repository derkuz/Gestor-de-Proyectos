import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Project } from './project.entity';

@Entity()
export class Documentation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', nullable: true })
    contenido: string; // Markdown / Mermaid

    @UpdateDateColumn()
    ultimaActualizacion: Date;

    @OneToOne(() => Project, (project) => project.documentacion)
    @JoinColumn()
    proyecto: Project;
}
