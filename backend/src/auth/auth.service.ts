import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private activityLogsService: ActivityLogsService,
    ) { }

    async register(userData: Partial<User>) {
        if (!userData.email || !userData.password) {
            throw new UnauthorizedException('Email y contraseña son requeridos');
        }

        const existing = await this.usersService.findByEmail(userData.email);
        if (existing) throw new ConflictException('El correo ya está en uso');

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await this.usersService.create({
            ...userData,
            password: hashedPassword,
        });

        await this.activityLogsService.log('REGISTER', `Nuevo usuario registrado: ${user.email}`, user.id);

        return this.login(user);
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);

        if (!user) {
            throw new UnauthorizedException('El correo electrónico no está registrado');
        }

        if (user.activo === false) {
            throw new UnauthorizedException('Tu cuenta ha sido deshabilitada. Contacta al administrador.');
        }

        const isPasswordMatching = await bcrypt.compare(pass, user.password);
        if (!isPasswordMatching) {
            throw new UnauthorizedException('La contraseña es incorrecta');
        }

        const { password, ...result } = user;
        return result;
    }

    async login(user: any) {
        await this.activityLogsService.log('LOGIN', `Inicio de sesión exitoso: ${user.email}`, user.id);
        const payload = { email: user.email, sub: user.id, rol: user.rol };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                nombre: user.nombre,
                rol: user.rol,
            },
        };
    }

    async requestPasswordReset(email: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) return; // Do not leak existence

        const token = Math.random().toString(36).substring(2, 12);
        const expires = new Date();
        expires.setHours(expires.getHours() + 1);

        await this.usersService.updateResetToken(user.id, token, expires);

        // TODO: Send real email. For now, we log it.
        console.log(`[MOCK EMAIL] Reset Token para ${email}: ${token}`);
        return { message: 'Si el correo existe, se ha enviado un código de recuperación.' };
    }

    async resetPassword(token: string, newPass: string) {
        const user = await this.usersService.findByResetToken(token);
        if (!user || user.resetTokenExpires! < new Date()) {
            throw new UnauthorizedException('Token inválido o expirado');
        }

        const hashedPassword = await bcrypt.hash(newPass, 10);
        await this.usersService.updatePassword(user.id, hashedPassword);
        return { message: 'Contraseña actualizada correctamente' };
    }
}
