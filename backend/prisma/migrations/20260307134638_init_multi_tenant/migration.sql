-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'PROJECT_MANAGER', 'COLABORADOR', 'EXTERNO');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVO', 'PAUSADO', 'FINALIZADO');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('BAJA', 'MEDIA', 'ALTA', 'CRITICA');

-- CreateTable
CREATE TABLE "Empresa" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "cuit" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'BASIC',
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "rol" "UserRole" NOT NULL DEFAULT 'COLABORADOR',
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resetToken" TEXT,
    "resetTokenExpires" TIMESTAMP(3),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "empresaId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "columnasKanban" JSONB,
    "estado" "ProjectStatus" NOT NULL DEFAULT 'ACTIVO',
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "empresaId" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "prioridad" "TaskPriority" NOT NULL DEFAULT 'MEDIA',
    "estado" TEXT NOT NULL DEFAULT 'Pendiente',
    "esSubtarea" BOOLEAN NOT NULL DEFAULT false,
    "fechaInicio" TIMESTAMP(3),
    "fechaFin" TIMESTAMP(3),
    "proyectoId" INTEGER NOT NULL,
    "padreId" TEXT,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "categoria" TEXT NOT NULL DEFAULT 'Soporte General',
    "mensaje" TEXT NOT NULL,
    "imagenUrl" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'ABIERTO',
    "respuestas" JSONB DEFAULT '[]',
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "empresaId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "categoriaId" TEXT,
    "tareaRelacionadaId" TEXT,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Documentation" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "url" TEXT,
    "ultimaActualizacion" TIMESTAMP(3) NOT NULL,
    "proyectoId" INTEGER NOT NULL,

    CONSTRAINT "Documentation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "accion" TEXT NOT NULL,
    "detalle" TEXT NOT NULL,
    "ip" TEXT,
    "tipo" TEXT,
    "entidadId" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "empresaId" TEXT NOT NULL,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_TaskToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TaskToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_cuit_key" ON "Empresa"("cuit");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_codigo_key" ON "Ticket"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_tareaRelacionadaId_key" ON "Ticket"("tareaRelacionadaId");

-- CreateIndex
CREATE INDEX "_ProjectToUser_B_index" ON "_ProjectToUser"("B");

-- CreateIndex
CREATE INDEX "_TaskToUser_B_index" ON "_TaskToUser"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_padreId_fkey" FOREIGN KEY ("padreId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_tareaRelacionadaId_fkey" FOREIGN KEY ("tareaRelacionadaId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documentation" ADD CONSTRAINT "Documentation_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToUser" ADD CONSTRAINT "_ProjectToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToUser" ADD CONSTRAINT "_ProjectToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaskToUser" ADD CONSTRAINT "_TaskToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaskToUser" ADD CONSTRAINT "_TaskToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
