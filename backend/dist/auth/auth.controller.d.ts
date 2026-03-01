import { AuthService } from './auth.service';
import { User } from '../entities/user.entity';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(userData: Partial<User>): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            nombre: any;
            rol: any;
        };
    }>;
    login(body: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            nombre: any;
            rol: any;
        };
    }>;
}
