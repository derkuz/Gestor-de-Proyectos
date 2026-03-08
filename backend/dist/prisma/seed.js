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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    const password123456 = await bcrypt.hash('123456', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);
    const empresa = await prisma.empresa.upsert({
        where: { cuit: '30-12345678-9' },
        update: {},
        create: {
            nombre: 'Empresa Demo SA',
            cuit: '30-12345678-9',
            plan: 'PREMIUM',
        },
    });
    console.log(`Empresa: ${empresa.nombre}`);
    const users = [
        {
            email: 'admin@demo.com',
            nombre: 'Super Administrador',
            password: adminPassword,
            rol: client_1.UserRole.SUPER_ADMIN,
        },
        {
            email: 'admin@ejemplo.com',
            nombre: 'Admin Sistema',
            password: password123456,
            rol: client_1.UserRole.ADMIN,
        },
        {
            email: 'pm@ejemplo.com',
            nombre: 'Gerente de Proyectos',
            password: password123456,
            rol: client_1.UserRole.PROJECT_MANAGER,
        },
        {
            email: 'dev@ejemplo.com',
            nombre: 'Desarrollador Senior',
            password: password123456,
            rol: client_1.UserRole.COLABORADOR,
        },
        {
            email: 'cliente@ejemplo.com',
            nombre: 'Cliente VIP',
            password: password123456,
            rol: client_1.UserRole.EXTERNO,
        },
    ];
    for (const u of users) {
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: { rol: u.rol },
            create: {
                ...u,
                empresaId: empresa.id,
            },
        });
        console.log(`Usuario ${user.rol} listo: ${user.email}`);
    }
    await prisma.project.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            nombre: 'Proyecto Inicial Multi-tenant',
            descripcion: 'Primer proyecto bajo la nueva arquitectura.',
            empresaId: empresa.id,
        },
    });
    console.log(`Proyecto inicial creado.`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map