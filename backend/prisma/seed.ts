
import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // 123456 en bcrypt
    const password123456 = await bcrypt.hash('123456', 10);
    // admin123 en bcrypt (para el admin@demo.com si prefieres mantenerlo separado, pero usaré 123456 para consistencia)
    const adminPassword = await bcrypt.hash('admin123', 10);

    // 1. Crear Empresa Principal
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

    const users: { email: string; nombre: string; password: string; rol: UserRole }[] = [
        {
            email: 'admin@demo.com',
            nombre: 'Super Administrador',
            password: adminPassword,
            rol: UserRole.SUPER_ADMIN,
        },
        {
            email: 'admin@ejemplo.com',
            nombre: 'Admin Sistema',
            password: password123456,
            rol: UserRole.ADMIN,
        },
        {
            email: 'pm@ejemplo.com',
            nombre: 'Gerente de Proyectos',
            password: password123456,
            rol: UserRole.PROJECT_MANAGER,
        },
        {
            email: 'dev@ejemplo.com',
            nombre: 'Desarrollador Senior',
            password: password123456,
            rol: UserRole.COLABORADOR,
        },
        {
            email: 'cliente@ejemplo.com',
            nombre: 'Cliente VIP',
            password: password123456,
            rol: UserRole.EXTERNO,
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

    // 3. Crear un proyecto inicial
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
