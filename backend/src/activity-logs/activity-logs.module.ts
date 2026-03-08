import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLog } from '../entities/activity-log.entity';
import { ActivityLogsService } from './activity-logs.service';
import { ActivityLogsController } from './activity-logs.controller';

import { User } from '../entities/user.entity';
import { Project } from '../entities/project.entity';
import { Ticket } from '../entities/ticket.entity';
import { Task } from '../entities/task.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ActivityLog, User, Project, Ticket, Task])],
    providers: [ActivityLogsService],
    controllers: [ActivityLogsController],
    exports: [ActivityLogsService],
})
export class ActivityLogsModule { }
