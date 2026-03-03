
import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

async function checkDocsRaw() {
    const client = new Client({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    await client.connect();

    try {
        const res = await client.query('SELECT * FROM documentation');
        console.log('TOTAL DOCS:', res.rows.length);
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (e) {
        console.error('ERROR QUERYING:', e.message);
    } finally {
        await client.end();
    }
}

checkDocsRaw().catch(console.error);
