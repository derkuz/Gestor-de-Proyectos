import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { TicketsService } from './tickets.service';
import { Ticket } from '../entities/ticket.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { getDynamicUploadPath } from '../utils/file-upload.utils';
import { GetUser } from '../auth/decorators/get-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async create(
        @Body() ticketData: any,
        @GetUser('sub') userId: string,
        @GetUser('empresaId') empresaId: string,
        @UploadedFile() file: Express.Multer.File
    ) {
        const payload = { ...ticketData };
        if (ticketData.categoriaRelacionadaId) {
            payload.categoriaRelacionada = { id: ticketData.categoriaRelacionadaId };
            delete payload.categoriaRelacionadaId;
        }

        return this.ticketsService.createWithAttachment(payload, userId, empresaId, file);
    }

    @Get()
    findAll(@GetUser('sub') userId: string, @GetUser('rol') role: string, @GetUser('empresaId') empresaId: string) {
        return this.ticketsService.findAll(userId, role, empresaId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @GetUser('empresaId') empresaId: string) {
        return this.ticketsService.findOne(id, empresaId);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateData: Partial<Ticket>,
        @GetUser('empresaId') empresaId: string,
        @GetUser('sub') userId: string,
        @GetUser('rol') role: string
    ) {
        return this.ticketsService.update(id, updateData, empresaId, userId, role);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string, @GetUser('empresaId') empresaId: string) {
        return this.ticketsService.remove(id, empresaId);
    }
}
