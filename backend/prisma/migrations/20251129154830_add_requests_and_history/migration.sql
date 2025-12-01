/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDIENTE', 'APROBADA', 'RECHAZADA');

-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('DESPLIEGUE', 'ACCESO', 'CAMBIO_TECNICO', 'OTRO');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Request" (
    "id" SERIAL NOT NULL,
    "publicId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "RequestType" NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDIENTE',
    "applicantId" INTEGER NOT NULL,
    "responsibleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestHistory" (
    "id" SERIAL NOT NULL,
    "requestId" INTEGER NOT NULL,
    "actorId" INTEGER NOT NULL,
    "previousStatus" "RequestStatus",
    "newStatus" "RequestStatus" NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequestHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Request_publicId_key" ON "Request"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestHistory" ADD CONSTRAINT "RequestHistory_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestHistory" ADD CONSTRAINT "RequestHistory_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
