
import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

async function fullAudit() {
    const client = new Client({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    await client.connect();

    try {
        console.log('--- ALL DOCUMENTS IN DB ---');
        const res = await client.query('SELECT d.*, p.nombre as project_name FROM documentation d LEFT JOIN project p ON d."proyectoId" = p.id');
        console.log('Count:', res.rows.length);
        console.table(res.rows.map(r => ({
            id: r.id,
            titulo: r.titulo,
            tipo: r.tipo,
            projectId: r.proyectoId,
            projectName: r.project_name
        })));

    } catch (e) {
        console.error('ERROR:', e.message);
    } finally {
        await client.end();
    }
}

fullAudit().catch(console.error);
