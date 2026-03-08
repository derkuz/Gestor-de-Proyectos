import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany, ManyToOne } from 'typeorm';
import { User, UserRole } from './user.entity';
import { Ticket } from './ticket.entity';
import { Empresa } from './empresa.entity';

@Entity('Category')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    nombre: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @Column({ length: 5, nullable: true })
    prefijo: string;

    @Column({
        type: 'simple-array',
        nullable: true,
        default: ''
    })
    rolesAutorizados: UserRole[];

    @ManyToMany(() => User)
    @JoinTable({
        name: 'category_authorized_users',
        joinColumn: { name: 'categoryId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' }
    })
    usuariosAutorizados: User[];

    @OneToMany(() => Ticket, (ticket) => ticket.categoriaRelacionada)
    tickets: Ticket[];

    @ManyToOne(() => Empresa, (empresa) => empresa.categorias)
    empresa: Empresa;

    @Column()
    empresaId: string;
}
