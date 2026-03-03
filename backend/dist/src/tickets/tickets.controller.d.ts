import { TicketsService } from './tickets.service';
import { Ticket } from '../entities/ticket.entity';
export declare class TicketsController {
    private readonly ticketsService;
    constructor(ticketsService: TicketsService);
    create(ticketData: any, req: any, file: Express.Multer.File): Promise<Ticket>;
    findAll(req: any): Promise<Ticket[]>;
    findOne(id: string): Promise<Ticket>;
    update(id: string, updateData: Partial<Ticket>, req: any): Promise<Ticket>;
    remove(id: string): Promise<void>;
}
