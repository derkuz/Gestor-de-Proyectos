import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Ticket } from './ticket.entity';

@Entity()
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    nombre: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @Column({ length: 5, nullable: true })
    prefijo: string;

    @ManyToMany(() => User)
    @JoinTable({
        name: 'category_authorized_users',
        joinColumn: { name: 'categoryId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' }
    })
    usuariosAutorizados: User[];

    @OneToMany(() => Ticket, (ticket) => ticket.categoriaRelacionada)
    tickets: Ticket[];
}
