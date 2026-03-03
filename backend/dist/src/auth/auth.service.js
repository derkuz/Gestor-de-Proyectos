"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    usersService;
    jwtService;
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async register(userData) {
        if (!userData.email || !userData.password) {
            throw new common_1.UnauthorizedException('Email y contraseña son requeridos');
        }
        const existing = await this.usersService.findByEmail(userData.email);
        if (existing)
            throw new common_1.ConflictException('El correo ya está en uso');
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await this.usersService.create({
            ...userData,
            password: hashedPassword,
        });
        return this.login(user);
    }
    async validateUser(email, pass) {
        const user = await this.usersService.findByEmail(email);
        if (user && user.password && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = { email: user.email, sub: user.id, rol: user.rol };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                nombre: user.nombre,
                rol: user.rol,
            },
        };
    }
    async requestPasswordReset(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user)
            return;
        const token = Math.random().toString(36).substring(2, 12);
        const expires = new Date();
        expires.setHours(expires.getHours() + 1);
        await this.usersService.updateResetToken(user.id, token, expires);
        console.log(`[MOCK EMAIL] Reset Token para ${email}: ${token}`);
        return { message: 'Si el correo existe, se ha enviado un código de recuperación.' };
    }
    async resetPassword(token, newPass) {
        const user = await this.usersService.findByResetToken(token);
        if (!user || user.resetTokenExpires < new Date()) {
            throw new common_1.UnauthorizedException('Token inválido o expirado');
        }
        const hashedPassword = await bcrypt.hash(newPass, 10);
        await this.usersService.updatePassword(user.id, hashedPassword);
        return { message: 'Contraseña actualizada correctamente' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map