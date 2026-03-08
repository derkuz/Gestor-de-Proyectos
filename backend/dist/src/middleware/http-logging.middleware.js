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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpLoggingMiddleware = void 0;
const common_1 = require("@nestjs/common");
const activity_logs_service_1 = require("../activity-logs/activity-logs.service");
let HttpLoggingMiddleware = class HttpLoggingMiddleware {
    activityLogsService;
    constructor(activityLogsService) {
        this.activityLogsService = activityLogsService;
    }
    use(req, res, next) {
        const start = Date.now();
        const { method, originalUrl } = req;
        res.on('finish', () => {
            const duration = Date.now() - start;
            const statusCode = res.statusCode;
            if (!originalUrl.includes('/activity-logs')) {
                const userId = req.user?.id;
                this.activityLogsService.log('HTTP_REQUEST', `[${method}] ${originalUrl} ${statusCode}`, userId, 'HTTP', undefined, undefined, duration, 'TECHNICAL').catch(err => console.error('Error logging HTTP request:', err));
            }
        });
        next();
    }
};
exports.HttpLoggingMiddleware = HttpLoggingMiddleware;
exports.HttpLoggingMiddleware = HttpLoggingMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [activity_logs_service_1.ActivityLogsService])
], HttpLoggingMiddleware);
//# sourceMappingURL=http-logging.middleware.js.map