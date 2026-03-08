-- 1. Habilitar extensión para UUID si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ASEGURAR COMPATIBILIDAD: Convertir columna rol a varchar si aún es enum
-- Esto evita errores de "invalid input value for enum" en el futuro
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

-- 3. Insertar Usuarios base
-- Super Administrador
INSERT INTO "user" (email, password, nombre, rol) 
VALUES ('admin@demo.com', '$2b$10$TBKGrJMcN0EktQmc6bTlz.Zm8DmU3EfqshsA03Z5aA61c3GDXBrau', 'Super Administrador', 'SUPER_ADMIN')
ON CONFLICT (email) DO UPDATE SET rol = 'SUPER_ADMIN';

-- Administrador
INSERT INTO "user" (email, password, nombre, rol) 
VALUES ('admin@ejemplo.com', '$2b$10$LT5m/w775a28HEGNryaIsuAzf/3OAl2z/En6vVENxfA98FBMp/6VO', 'Admin Sistema', 'ADMIN')
ON CONFLICT (email) DO UPDATE SET rol = 'ADMIN';

-- Project Manager
INSERT INTO "user" (email, password, nombre, rol) 
VALUES ('pm@ejemplo.com', '$2b$10$LT5m/w775a28HEGNryaIsuAzf/3OAl2z/En6vVENxfA98FBMp/6VO', 'Gerente de Proyectos', 'PROJECT_MANAGER')
ON CONFLICT (email) DO UPDATE SET rol = 'PROJECT_MANAGER';

-- Colaborador
INSERT INTO "user" (email, password, nombre, rol) 
VALUES ('dev@ejemplo.com', '$2b$10$LT5m/w775a28HEGNryaIsuAzf/3OAl2z/En6vVENxfA98FBMp/6VO', 'Desarrollador Senior', 'COLABORADOR')
ON CONFLICT (email) DO UPDATE SET rol = 'COLABORADOR';

-- Usuario Externo
INSERT INTO "user" (email, password, nombre, rol) 
VALUES ('cliente@ejemplo.com', '$2b$10$LT5m/w775a28HEGNryaIsuAzf/3OAl2z/En6vVENxfA98FBMp/6VO', 'Cliente VIP', 'EXTERNO')
ON CONFLICT (email) DO UPDATE SET rol = 'EXTERNO';

