-- 1. Habilitar extensión para UUID si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Asegurar que exista una empresa por defecto
INSERT INTO "empresa" (id, nombre, cuit, plan, "fechaRegistro", activo)
VALUES ('7b34b7f0-0000-0000-0000-000000000000', 'Empresa Demo SA', '30-12345678-9', 'PREMIUM', NOW(), true)
ON CONFLICT (cuit) DO NOTHING;

-- 3. ASEGURAR COMPATIBILIDAD: Convertir columna rol a varchar si aún es enum
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user' AND column_name = 'rol' AND udt_name = 'user_rol_enum'
    ) THEN
        ALTER TABLE "user" ALTER COLUMN "rol" TYPE varchar(20);
        DROP TYPE IF EXISTS user_rol_enum CASCADE;
    END IF;
END $$;

-- 4. Insertar Usuarios base vinculados a la empresa
-- El ID de empresa '7b34b7f0-0000-0000-0000-000000000000' es el que creamos arriba

-- Super Administrador (admin123)
INSERT INTO "user" (id, email, password, nombre, rol, "empresaId", "fechaRegistro", activo) 
VALUES (uuid_generate_v4(), 'admin@demo.com', '$2b$10$TBKGrJMcN0EktQmc6bTlz.Zm8DmU3EfqshsA03Z5aA61c3GDXBrau', 'Super Administrador', 'SUPER_ADMIN', '7b34b7f0-0000-0000-0000-000000000000', NOW(), true)
ON CONFLICT (email) DO UPDATE SET rol = 'SUPER_ADMIN';

-- Administrador (123456)
INSERT INTO "user" (id, email, password, nombre, rol, "empresaId", "fechaRegistro", activo) 
VALUES (uuid_generate_v4(), 'admin@ejemplo.com', '$2b$10$LT5m/w775a28HEGNryaIsuAzf/3OAl2z/En6vVENxfA98FBMp/6VO', 'Admin Sistema', 'ADMIN', '7b34b7f0-0000-0000-0000-000000000000', NOW(), true)
ON CONFLICT (email) DO UPDATE SET rol = 'ADMIN';

-- Project Manager
INSERT INTO "user" (id, email, password, nombre, rol, "empresaId", "fechaRegistro", activo) 
VALUES (uuid_generate_v4(), 'pm@ejemplo.com', '$2b$10$LT5m/w775a28HEGNryaIsuAzf/3OAl2z/En6vVENxfA98FBMp/6VO', 'Gerente de Proyectos', 'PROJECT_MANAGER', '7b34b7f0-0000-0000-0000-000000000000', NOW(), true)
ON CONFLICT (email) DO UPDATE SET rol = 'PROJECT_MANAGER';

-- Colaborador
INSERT INTO "user" (id, email, password, nombre, rol, "empresaId", "fechaRegistro", activo) 
VALUES (uuid_generate_v4(), 'dev@ejemplo.com', '$2b$10$LT5m/w775a28HEGNryaIsuAzf/3OAl2z/En6vVENxfA98FBMp/6VO', 'Desarrollador Senior', 'COLABORADOR', '7b34b7f0-0000-0000-0000-000000000000', NOW(), true)
ON CONFLICT (email) DO UPDATE SET rol = 'COLABORADOR';

-- Usuario Externo
INSERT INTO "user" (id, email, password, nombre, rol, "empresaId", "fechaRegistro", activo) 
VALUES (uuid_generate_v4(), 'cliente@ejemplo.com', '$2b$10$LT5m/w775a28HEGNryaIsuAzf/3OAl2z/En6vVENxfA98FBMp/6VO', 'Cliente VIP', 'EXTERNO', '7b34b7f0-0000-0000-0000-000000000000', NOW(), true)
ON CONFLICT (email) DO UPDATE SET rol = 'EXTERNO';

