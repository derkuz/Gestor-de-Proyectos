
import { createConnection } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

async function removeContenidoColumn() {
    const connection = await createConnection({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5434,
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'sgpt_db',
        synchronize: false,
    });

    try {
        console.log('Checking for "contenido" column in "documentation" table...');
        const result = await connection.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'documentation' AND column_name = 'contenido';
        `);

        if (result.length > 0) {
            console.log('Column "contenido" found. Dropping it...');
            await connection.query('ALTER TABLE documentation DROP COLUMN contenido;');
            console.log('Column "contenido" dropped successfully.');
        } else {
            console.log('Column "contenido" not found. Nothing to do.');
        }
    } catch (error) {
        console.error('Error dropping column:', error);
    } finally {
        await connection.close();
    }
}

removeContenidoColumn().catch(console.error);
