
import { createConnection } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

async function checkColumns() {
    const connection = await createConnection({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5434, // Default to host port if running from host
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'sgpt_db',
        synchronize: false,
    });

    const result = await connection.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'documentation';
    `);

    console.log('Columns in documentation table:');
    console.table(result);

    const hasContenido = result.some((c: any) => c.column_name === 'contenido');
    if (hasContenido) {
        console.log('WARNING: Column "contenido" still exists.');
    } else {
        console.log('SUCCESS: Column "contenido" does not exist.');
    }

    await connection.close();
}

checkColumns().catch(console.error);
