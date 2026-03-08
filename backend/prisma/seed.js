
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://postgres:password@localhost:5434/sgpt_db?schema=public"
        }
    }
});

async function main() {
    console.log('Iniciando seed...');
    const hashedPassword = await bcrypt.hash('password', 10);

    // 1. Crear Empresa Principal
    console.log('Creando empresa...');
    const empresa = await prisma.empresa.create({
        data: {
            nombre: 'Empresa Demo SA',
            cuit: '30-12345678-9',
            plan: 'PREMIUM',
        },
    });

    console.log(`Empresa creada: ${empresa.nombre} (ID: ${empresa.id})`);

    // 2. Crear Usuario Admin vinculado a esa empresa
    const admin = await prisma.user.create({
        data: {
            email: 'admin@demo.com',
            nombre: 'Administrador Senior',
            password: hashedPassword,
            rol: 'ADMIN',
            empresaId: empresa.id,
        },
    });

    console.log(`Usuario admin creado: ${admin.email}`);

    // 3. Crear un proyecto inicial para esa empresa
    const proyecto = await prisma.project.create({
        data: {
            nombre: 'Proyecto Inicial Multi-tenant',
            descripcion: 'Primer proyecto bajo la nueva arquitectura.',
            empresaId: empresa.id,
        },
    });

    console.log(`Proyecto creado: ${proyecto.nombre}`);
}

main()
    .catch((e) => {
        console.error('ERROR EN SEED:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
