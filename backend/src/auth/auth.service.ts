import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
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

        return this.login(user);
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && user.password && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
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
}
