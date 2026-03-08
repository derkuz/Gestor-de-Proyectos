import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(empresaId: string, rol: string): Promise<User[]>;
    create(userData: Partial<User>, empresaId: string): Promise<User>;
    update(id: string, updateData: Partial<User>, empresaId: string, rol: string): Promise<User>;
    adminResetPassword(id: string, newPass: string, empresaId: string, rol: string): Promise<void>;
}
