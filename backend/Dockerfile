# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Generar cliente Prisma
RUN npx prisma generate

# Construir la aplicación
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copiar solo lo necesario desde el stage de construcción
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Crear el directorio para los archivos subidos
RUN mkdir -p /app/uploads

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"]
