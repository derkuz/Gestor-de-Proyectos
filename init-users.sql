-- Habilitar extensión para UUID si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insertar Administrador
INSERT INTO "user" (email, password, nombre, rol) 
VALUES ('admin@ejemplo.com', '$2b$10$LT5m/w775a28HEGNryaIsuAzf/3OAl2z/En6vVENxfA98FBMp/6VO', 'Admin Sistema', 'ADMIN')
ON CONFLICT (email) DO NOTHING;

-- Insertar Project Manager
INSERT INTO "user" (email, password, nombre, rol) 
VALUES ('pm@ejemplo.com', '$2b$10$LT5m/w775a28HEGNryaIsuAzf/3OAl2z/En6vVENxfA98FBMp/6VO', 'Gerente de Proyectos', 'PROJECT_MANAGER')
ON CONFLICT (email) DO NOTHING;

-- Insertar Colaborador (Desarrollador)
INSERT INTO "user" (email, password, nombre, rol) 
VALUES ('dev@ejemplo.com', '$2b$10$LT5m/w775a28HEGNryaIsuAzf/3OAl2z/En6vVENxfA98FBMp/6VO', 'Desarrollador Senior', 'COLABORADOR')
ON CONFLICT (email) DO NOTHING;

-- Insertar Usuario Externo (Cliente)
INSERT INTO "user" (email, password, nombre, rol) 
VALUES ('cliente@ejemplo.com', '$2b$10$LT5m/w775a28HEGNryaIsuAzf/3OAl2z/En6vVENxfA98FBMp/6VO', 'Cliente VIP', 'EXTERNO')
ON CONFLICT (email) DO NOTHING;
