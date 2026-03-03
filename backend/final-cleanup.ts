
import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

async function finalCleanup() {
    const client = new Client({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    await client.connect();

    try {
        console.log('--- BUSCANDO TODOS LOS DOCS SIN FILTRO ---');
        const res = await client.query('SELECT * FROM documentation');
        console.log('Registros totales en la tabla:', res.rows.length);
        res.rows.forEach(r => console.log(r));

        console.log('\n--- VERIFICANDO RELACION EN TABLA PROJECT ---');
        // Vemos si existe la columna documentacionId en project (residuo del OneToOne)
        const projectCols = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'project'");
        const hasOldCol = projectCols.rows.some(c => c.column_name === 'documentacionId');
        console.log('¿Existe columna antigua documentacionId?:', hasOldCol);

        if (hasOldCol) {
            const projectsWithOldDoc = await client.query('SELECT id, nombre, "documentacionId" FROM project WHERE "documentacionId" IS NOT NULL');
            console.log('Proyectos con residuo OneToOne:', projectsWithOldDoc.rows);
        }

    } catch (e) {
        console.error('ERROR:', e.message);
    } finally {
        await client.end();
    }
}

finalCleanup().catch(console.error);
