
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { ProjectsModule } from '../projects/projects.module';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [ProjectsModule, ActivityLogsModule, UsersModule],
    controllers: [AdminController],
})
export class AdminModule { }
