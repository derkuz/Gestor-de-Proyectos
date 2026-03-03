import { Repository } from 'typeorm';
import { Ticket } from '../entities/ticket.entity';
export declare class TicketsService {
    private ticketsRepository;
    constructor(ticketsRepository: Repository<Ticket>);
    create(ticketData: any, userId: string): Promise<Ticket>;
    findAll(userId: string, role: string): Promise<Ticket[]>;
    findOne(id: string): Promise<Ticket>;
    update(id: string, updateData: Partial<Ticket>, userId?: string, role?: string): Promise<Ticket>;
    remove(id: string): Promise<void>;
}
