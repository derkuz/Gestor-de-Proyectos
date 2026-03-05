import { Controller, Get, UseGuards, Patch, Param, Body, Post, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User, UserRole } from '../entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Post()
    @Roles(UserRole.ADMIN)
    create(@Body() userData: Partial<User>) {
        return this.usersService.create(userData);
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    update(@Param('id') id: string, @Body() updateData: Partial<User>) {
        return this.usersService.update(id, updateData);
    }

    @Patch(':id/password')
    @Roles(UserRole.ADMIN)
    async adminResetPassword(@Param('id') id: string, @Body('password') newPass: string) {
        return this.usersService.adminUpdatePassword(id, newPass);
    }
}
