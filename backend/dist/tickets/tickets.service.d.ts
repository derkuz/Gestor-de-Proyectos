import { Repository } from 'typeorm';
import { Ticket } from '../entities/ticket.entity';
export declare class TicketsService {
    private ticketsRepository;
    constructor(ticketsRepository: Repository<Ticket>);
    create(ticketData: Partial<Ticket>): Promise<Ticket>;
    findAll(): Promise<Ticket[]>;
    findOne(id: string): Promise<Ticket>;
    update(id: string, updateData: Partial<Ticket>): Promise<Ticket>;
    remove(id: string): Promise<void>;
}
