"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const user_entity_1 = require("./entities/user.entity");
const project_entity_1 = require("./entities/project.entity");
const task_entity_1 = require("./entities/task.entity");
const ticket_entity_1 = require("./entities/ticket.entity");
const documentation_entity_1 = require("./entities/documentation.entity");
const category_entity_1 = require("./entities/category.entity");
const activity_log_entity_1 = require("./entities/activity-log.entity");
const users_module_1 = require("./users/users.module");
const activity_logs_module_1 = require("./activity-logs/activity-logs.module");
const auth_module_1 = require("./auth/auth.module");
const projects_module_1 = require("./projects/projects.module");
const tasks_module_1 = require("./tasks/tasks.module");
const tickets_module_1 = require("./tickets/tickets.module");
const documentation_module_1 = require("./documentation/documentation.module");
const categories_module_1 = require("./categories/categories.module");
const http_logging_middleware_1 = require("./middleware/http-logging.middleware");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(http_logging_middleware_1.HttpLoggingMiddleware)
            .forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), 'uploads'),
                serveRoot: '/uploads',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST'),
                    port: configService.get('DB_PORT'),
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_NAME'),
                    entities: [user_entity_1.User, project_entity_1.Project, task_entity_1.Task, ticket_entity_1.Ticket, documentation_entity_1.Documentation, category_entity_1.Category, activity_log_entity_1.ActivityLog],
                    synchronize: true,
                }),
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            projects_module_1.ProjectsModule,
            tasks_module_1.TasksModule,
            tickets_module_1.TicketsModule,
            documentation_module_1.DocumentationModule,
            categories_module_1.CategoriesModule,
            activity_logs_module_1.ActivityLogsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map