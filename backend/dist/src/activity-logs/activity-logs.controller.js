"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLogsController = void 0;
const common_1 = require("@nestjs/common");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const activity_logs_service_1 = require("./activity-logs.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../entities/user.entity");
let ActivityLogsController = class ActivityLogsController {
    activityLogsService;
    constructor(activityLogsService) {
        this.activityLogsService = activityLogsService;
    }
    findAll(limit, empresaId, rol) {
        return this.activityLogsService.findAll(empresaId, limit ? Number(limit) : 50, rol === user_entity_1.UserRole.SUPER_ADMIN);
    }
    async purge() {
        const deletedCount = await this.activityLogsService.purgeOldLogs();
        return { message: 'Logs técnicos depurados', deletedCount };
    }
};
exports.ActivityLogsController = ActivityLogsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, get_user_decorator_1.GetUser)('empresaId')),
    __param(2, (0, get_user_decorator_1.GetUser)('rol')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", void 0)
], ActivityLogsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('purge'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ActivityLogsController.prototype, "purge", null);
exports.ActivityLogsController = ActivityLogsController = __decorate([
    (0, common_1.Controller)('activity-logs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [activity_logs_service_1.ActivityLogsService])
], ActivityLogsController);
//# sourceMappingURL=activity-logs.controller.js.map