
import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { Empresa } from '../entities/empresa.entity';

@Controller('admin/companies')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) { }

    @Get()
    findAll() {
        return this.companiesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.companiesService.findOne(id);
    }

    @Post()
    create(@Body() data: Partial<Empresa>) {
        return this.companiesService.create(data);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() data: Partial<Empresa>) {
        return this.companiesService.update(id, data);
    }

    @Patch(':id/toggle-status')
    toggleStatus(@Param('id') id: string) {
        return this.companiesService.toggleStatus(id);
    }
}
