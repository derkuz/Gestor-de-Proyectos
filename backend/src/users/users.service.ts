import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private activityLogsService: ActivityLogsService,
    ) { }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { email },
            select: ['id', 'email', 'password', 'nombre', 'rol', 'activo'] // Include activo
        });
    }

    async create(userData: Partial<User>): Promise<User> {
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }
        const user = this.usersRepository.create(userData);
        const saved = await this.usersRepository.save(user);
        await this.activityLogsService.log('CREATE_USER', `Usuario creado: ${user.email}`, undefined, 'USER', saved.id);
        return saved;
    }

    async update(id: string, updateData: Partial<User>): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) throw new Error('Usuario no encontrado');

        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        Object.assign(user, updateData);
        const saved = await this.usersRepository.save(user);
        await this.activityLogsService.log('UPDATE_USER', `Usuario actualizado/estado cambiado: ${user.email}`, undefined, 'USER', id);
        return saved;
    }

    async updateResetToken(id: string, token: string, expires: Date) {
        await this.usersRepository.update(id, {
            resetToken: token,
            resetTokenExpires: expires
        });
    }

    async findByResetToken(token: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { resetToken: token },
            select: ['id', 'resetTokenExpires']
        });
    }

    async updatePassword(id: string, passwordHash: string) {
        await this.usersRepository.update(id, {
            password: passwordHash,
            resetToken: null as any,
            resetTokenExpires: null as any
        });
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find({
            select: ['id', 'nombre', 'email', 'rol', 'activo']
        });
    }

    async adminUpdatePassword(id: string, newPass: string) {
        const user = await this.usersRepository.findOne({ where: { id } });
        const passwordHash = await bcrypt.hash(newPass, 10);
        await this.activityLogsService.log('ADMIN_RESET_PASSWORD', `Contraseña reseteada para el usuario: ${user ? user.email : id}`, undefined, 'USER', id);
        return this.updatePassword(id, passwordHash);
    }
}
