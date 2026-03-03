import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Project } from './project.entity';

export enum DocType {
    MD = 'MD',
    LINK = 'LINK',
    FILE = 'FILE',
}

@Entity()
export class Documentation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    titulo: string;

    @Column({
        type: 'enum',
        enum: DocType,
        default: DocType.MD,
    })
    tipo: DocType;

    @Column({ type: 'text', nullable: true })
    contenido: string; // Used for MD

    @Column({ nullable: true })
    url: string; // Used for LINK or FILE

    @UpdateDateColumn()
    ultimaActualizacion: Date;

    @ManyToOne(() => Project, (project) => project.documentos)
    proyecto: Project;
}
