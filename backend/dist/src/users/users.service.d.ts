import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
export declare class UsersService {
    private usersRepository;
    private activityLogsService;
    constructor(usersRepository: Repository<User>, activityLogsService: ActivityLogsService);
    findByEmail(email: string): Promise<User | null>;
    create(userData: Partial<User>): Promise<User>;
    updateResetToken(id: string, token: string, expires: Date): Promise<void>;
    findByResetToken(token: string): Promise<User | null>;
    updatePassword(id: string, passwordHash: string): Promise<void>;
    findAll(): Promise<User[]>;
    adminUpdatePassword(id: string, newPass: string): Promise<void>;
}
