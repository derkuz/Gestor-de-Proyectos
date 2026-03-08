
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function reset() {
    const hash = await bcrypt.hash('admin123', 10);
    await prisma.user.update({
        where: { email: 'admin@demo.com' },
        data: { password: hash }
    });
    console.log('Password for admin@demo.com reset to: admin123');
    await prisma.$disconnect();
}

reset();
