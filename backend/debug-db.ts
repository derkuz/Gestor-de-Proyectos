
import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

async function debugDatabase() {
    const client = new Client({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    await client.connect();

    try {
        console.log('--- ESTRUCTURA DE LA TABLA ---');
        const schema = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'documentation'
        `);
        console.table(schema.rows);

        console.log('\n--- TODOS LOS REGISTROS ---');
        const res = await client.query('SELECT * FROM documentation');
        console.log('Total registros:', res.rows.length);
        res.rows.forEach((row, i) => {
            console.log(`[${i}] ID: "${row.id}", Titulo: "${row.titulo}", ProyectoID: "${row.proyectoId}"`);
        });

        if (res.rows.length > 0) {
            console.log('\n--- DETALLE DEL PRIMER REGISTRO ---');
            console.log(res.rows[0]);
        }
    } catch (e) {
        console.error('ERROR:', e.message);
    } finally {
        await client.end();
    }
}

debugDatabase().catch(console.error);
