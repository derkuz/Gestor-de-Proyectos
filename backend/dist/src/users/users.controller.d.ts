import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<User[]>;
    create(userData: Partial<User>): Promise<User>;
    update(id: string, updateData: Partial<User>): Promise<User>;
    adminResetPassword(id: string, newPass: string): Promise<void>;
}
