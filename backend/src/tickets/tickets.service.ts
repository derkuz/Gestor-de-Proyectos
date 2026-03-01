import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../entities/ticket.entity';

@Injectable()
export class TicketsService {
    constructor(
        @InjectRepository(Ticket)
        private ticketsRepository: Repository<Ticket>,
    ) { }

    async create(ticketData: Partial<Ticket>): Promise<Ticket> {
        const ticket = this.ticketsRepository.create(ticketData);
        return this.ticketsRepository.save(ticket);
    }

    async findAll(): Promise<Ticket[]> {
        return this.ticketsRepository.find({ relations: ['tareaRelacionada'] });
    }

    async findOne(id: string): Promise<Ticket> {
        const ticket = await this.ticketsRepository.findOne({
            where: { id },
            relations: ['tareaRelacionada'],
        });
        if (!ticket) throw new NotFoundException('Ticket no encontrado');
        return ticket;
    }

    async update(id: string, updateData: Partial<Ticket>): Promise<Ticket> {
        const ticket = await this.findOne(id);
        Object.assign(ticket, updateData);
        return this.ticketsRepository.save(ticket);
    }

    async remove(id: string): Promise<void> {
        const ticket = await this.findOne(id);
        await this.ticketsRepository.remove(ticket);
    }
}
