import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../entities/user.entity';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private activityLogsService;
    constructor(usersService: UsersService, jwtService: JwtService, activityLogsService: ActivityLogsService);
    register(userData: Partial<User>): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            nombre: any;
            rol: any;
            empresaId: any;
        };
    }>;
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            nombre: any;
            rol: any;
            empresaId: any;
        };
    }>;
    requestPasswordReset(email: string): Promise<{
        message: string;
    } | undefined>;
    resetPassword(token: string, newPass: string): Promise<{
        message: string;
    }>;
}
