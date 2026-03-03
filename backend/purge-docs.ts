
import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

async function scorchedEarth() {
    const client = new Client({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    await client.connect();

    try {
        console.log('--- PURGING ALL DOCUMENTATION ---');
        const res = await client.query('DELETE FROM documentation');
        console.log('Fueron eliminados:', res.rowCount, 'registros.');

        // También por si acaso existe el campo antiguo y no lo vi bien (aunque ya chequeé)
        // Pero no quiero romper el schema si no existe.
    } catch (e) {
        console.error('ERROR:', e.message);
    } finally {
        await client.end();
    }
}

scorchedEarth().catch(console.error);
