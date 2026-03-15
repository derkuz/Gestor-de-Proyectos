import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Project } from './project.entity';

export enum DocType {
    MD = 'MD',
    LINK = 'LINK',
    FILE = 'FILE',
}

@Entity('documentation')
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

    @Column({ nullable: true })
    url: string; // URL del archivo físico o link externo

    @UpdateDateColumn()
    ultimaActualizacion: Date;

    @ManyToOne(() => Project, (project) => project.documentos)
    proyecto: Project;
}
