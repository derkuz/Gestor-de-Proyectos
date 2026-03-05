import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../entities/user.entity';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() userData: Partial<User>) {
        return this.authService.register(userData);
    }

    @Post('login')
    async login(@Body() body: any) {
        const user = await this.authService.validateUser(body.email, body.password);
        return this.authService.login(user);
    }

    @Post('forgot-password')
    async forgotPassword(@Body('email') email: string) {
        return this.authService.requestPasswordReset(email);
    }

    @Post('reset-password')
    async resetPassword(@Body() body: any) {
        return this.authService.resetPassword(body.token, body.newPassword);
    }
}
