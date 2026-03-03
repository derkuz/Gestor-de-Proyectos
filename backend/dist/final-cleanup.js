"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
dotenv.config({ path: path.join(__dirname, '.env') });
async function finalCleanup() {
    const client = new pg_1.Client({
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
        const projectCols = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'project'");
        const hasOldCol = projectCols.rows.some(c => c.column_name === 'documentacionId');
        console.log('¿Existe columna antigua documentacionId?:', hasOldCol);
        if (hasOldCol) {
            const projectsWithOldDoc = await client.query('SELECT id, nombre, "documentacionId" FROM project WHERE "documentacionId" IS NOT NULL');
            console.log('Proyectos con residuo OneToOne:', projectsWithOldDoc.rows);
        }
    }
    catch (e) {
        console.error('ERROR:', e.message);
    }
    finally {
        await client.end();
    }
}
finalCleanup().catch(console.error);
//# sourceMappingURL=final-cleanup.js.map