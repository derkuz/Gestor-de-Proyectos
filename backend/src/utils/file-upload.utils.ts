import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

/**
 * Genera una ruta dinámica para la subida de archivos:
 * [basePath]/[identifier]/[mm]/[yyyy]
 * Asegura que el directorio exista.
 */
export const getDynamicUploadPath = (basePath: string, identifier: string) => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear());

    // Limpiar el identificador para evitar problemas con nombres de carpetas
    const sanitizedIdentifier = identifier.replace(/[^a-z0-9_\-]/gi, '_').toLowerCase();

    // La ruta base debe ser absoluta o relativa a la raíz del proyecto
    const relativePath = join(basePath, sanitizedIdentifier, month, year);
    
    // Ruta absoluta para verificar/crear carpetas
    const absolutePath = join(process.cwd(), relativePath);

    if (!existsSync(absolutePath)) {
        mkdirSync(absolutePath, { recursive: true });
    }

    return absolutePath;
};
