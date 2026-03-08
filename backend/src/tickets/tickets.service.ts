import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../entities/ticket.entity';
import { Category } from '../entities/category.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TicketsService {
    constructor(
        @InjectRepository(Ticket)
        private ticketsRepository: Repository<Ticket>,
    ) { }

    async create(ticketData: any, userId: string, empresaId: string): Promise<Ticket> {
        let codigo = `TK-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

        if (ticketData.categoriaRelacionada?.id) {
            const category = await this.ticketsRepository.manager.findOne(Category, {
                where: { id: ticketData.categoriaRelacionada.id, empresaId },
            }) as Category;

            if (category && category.prefijo) {
                const count = await this.ticketsRepository.count({
                    where: { categoriaRelacionada: { id: category.id }, empresaId },
                });
                codigo = `${category.prefijo.toUpperCase()}-${(count + 1).toString().padStart(3, '0')}`;
            }
        }

        const ticket = this.ticketsRepository.create({
            ...ticketData,
            codigo: ticketData.codigo || codigo,
            usuario: { id: userId } as any,
            empresaId,
        }) as unknown as Ticket;
        return this.ticketsRepository.save(ticket);
    }

    async createWithAttachment(ticketData: any, userId: string, empresaId: string, file?: Express.Multer.File): Promise<Ticket> {
        const ticket = await this.create(ticketData, userId, empresaId);

        if (file) {
            const currentYear = new Date().getFullYear().toString();
            const relativeDir = `/uploads/Ticket_adjuntos/${currentYear}/${ticket.id}`;
            const uploadDir = path.resolve('.' + relativeDir);

            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

            const fileName = `${Date.now()}${path.extname(file.originalname)}`;
            const filePath = path.join(uploadDir, fileName);

            fs.writeFileSync(filePath, file.buffer);

            ticket.imagenUrl = `${relativeDir}/${fileName}`;
            await this.ticketsRepository.update(ticket.id, { imagenUrl: ticket.imagenUrl });
        }

        return ticket;
    }

    async findAll(userId: string, role: string, empresaId: string): Promise<Ticket[]> {
        const query = this.ticketsRepository.createQueryBuilder('ticket')
            .leftJoinAndSelect('ticket.tareaRelacionada', 'tareaRelacionada')
            .leftJoinAndSelect('ticket.usuario', 'usuario')
            .leftJoinAndSelect('ticket.categoriaRelacionada', 'categoriaRelacionada')
            .leftJoin('categoriaRelacionada.usuariosAutorizados', 'autorizado')
            .where('ticket.empresaId = :empresaId', { empresaId });

        if (role === 'ADMIN') {
            // ADMIN ve todo de su empresa
        } else {
            query.andWhere(
                '(usuario.id = :userId OR autorizado.id = :userId OR categoriaRelacionada.rolesAutorizados LIKE :role)',
                { userId, role: `%${role}%` }
            );
        }

        return query.getMany();
    }

    async findOne(id: string, empresaId: string): Promise<Ticket> {
        const ticket = await this.ticketsRepository.findOne({
            where: { id, empresaId },
            relations: ['tareaRelacionada', 'usuario', 'categoriaRelacionada', 'categoriaRelacionada.usuariosAutorizados'],
        });
        if (!ticket) throw new NotFoundException('Ticket no encontrado en tu empresa');
        return ticket;
    }

    async update(id: string, updateData: Partial<Ticket>, empresaId: string, userId?: string, role?: string): Promise<Ticket> {
        const ticket = await this.findOne(id, empresaId);

        if (userId && role && role !== 'ADMIN') {
            const isOwner = ticket.usuario?.id === userId;
            const isExplicitAuthorized = ticket.categoriaRelacionada?.usuariosAutorizados?.some(u => u.id === userId);
            const isRoleAuthorized = ticket.categoriaRelacionada?.rolesAutorizados?.includes(role as any);

            if (!isOwner && !isExplicitAuthorized && !isRoleAuthorized) {
                throw new ForbiddenException('No tienes permiso para modificar este ticket');
            }
        }

        Object.assign(ticket, updateData);
        return this.ticketsRepository.save(ticket);
    }

    async remove(id: string, empresaId: string): Promise<void> {
        const ticket = await this.findOne(id, empresaId);
        await this.ticketsRepository.remove(ticket);
    }
}
