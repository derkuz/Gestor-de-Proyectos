import { Controller, Get, UseGuards, Patch, Param, Body, Post, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User, UserRole } from '../entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    findAll(@GetUser('empresaId') empresaId: string, @GetUser('rol') rol: string) {
        return this.usersService.findAll(empresaId, rol === UserRole.SUPER_ADMIN);
    }

    @Post()
    @Roles(UserRole.ADMIN)
    create(@Body() userData: Partial<User>, @GetUser('empresaId') empresaId: string) {
        return this.usersService.create(userData, empresaId);
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    update(
        @Param('id') id: string,
        @Body() updateData: Partial<User>,
        @GetUser('empresaId') empresaId: string,
        @GetUser('rol') rol: string
    ) {
        return this.usersService.update(id, updateData, empresaId, rol === UserRole.SUPER_ADMIN);
    }

    @Patch(':id/password')
    @Roles(UserRole.ADMIN)
    async adminResetPassword(
        @Param('id') id: string,
        @Body('password') newPass: string,
        @GetUser('empresaId') empresaId: string,
        @GetUser('rol') rol: string
    ) {
        return this.usersService.adminUpdatePassword(id, newPass, empresaId, rol === UserRole.SUPER_ADMIN);
    }
}
