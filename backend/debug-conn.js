
const { Client } = require('pg');
const client = new Client({
    connectionString: "postgresql://postgres:password@localhost:5434/sgpt_db",
});
client.connect()
    .then(() => {
        console.log('CONECTADO EXITOSAMENTE');
        return client.query('SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = \'public\'');
    })
    .then(res => {
        console.log('TABLAS:', res.rows.map(r => r.tablename));
        process.exit(0);
    })
    .catch(err => {
        console.error('ERROR DE CONEXION:', err);
        process.exit(1);
    });
