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
            select: ['id', 'email', 'password', 'nombre', 'rol'] // Ensure password is included for login
        });
    }

    async create(userData: Partial<User>): Promise<User> {
        const user = this.usersRepository.create(userData);
        return this.usersRepository.save(user);
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
            select: ['id', 'nombre', 'email', 'rol']
        });
    }

    async adminUpdatePassword(id: string, newPass: string) {
        const user = await this.usersRepository.findOne({ where: { id } });
        const passwordHash = await bcrypt.hash(newPass, 10);
        await this.activityLogsService.log('ADMIN_RESET_PASSWORD', `Contraseña reseteada para el usuario: ${user ? user.email : id}`, undefined, 'USER', id);
        return this.updatePassword(id, passwordHash);
    }
}
