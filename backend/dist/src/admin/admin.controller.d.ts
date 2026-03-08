import { ProjectsService } from '../projects/projects.service';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { UsersService } from '../users/users.service';
export declare class AdminController {
    private readonly projectsService;
    private readonly activityLogsService;
    private readonly usersService;
    constructor(projectsService: ProjectsService, activityLogsService: ActivityLogsService, usersService: UsersService);
    getGlobalStats(empresaId: string, rol: string): Promise<any>;
}
