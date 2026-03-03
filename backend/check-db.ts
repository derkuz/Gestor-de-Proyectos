
import { createConnection } from 'typeorm';
import { Documentation } from './src/entities/documentation.entity';
import { Project } from './src/entities/project.entity';
import * as dotenv from 'dotenv';

dotenv.config();

async function checkDocs() {
    const connection = await createConnection({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [Documentation, Project],
        synchronize: false,
    });

    const docs = await connection.getRepository(Documentation).find({ relations: ['proyecto'] });
    console.log('TOTAL DOCS IN DB:', docs.length);
    docs.forEach(d => {
        console.log(`ID: ${d.id}, Titulo: ${d.titulo}, ProyectoID: ${d.proyecto?.id}`);
    });

    await connection.close();
}

checkDocs().catch(console.error);
