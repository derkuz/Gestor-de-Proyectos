
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { ProjectsModule } from '../projects/projects.module';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';

@Module({
    imports: [ProjectsModule, ActivityLogsModule],
    controllers: [AdminController],
})
export class AdminModule { }
