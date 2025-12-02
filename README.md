# Flujo de Aprobaciones – Ejecución Local

Bienvenido.
Este repositorio contiene un sistema completo de gestión de solicitudes y flujo de aprobaciones, con:

Backend: Node.js + Express + Prisma

Frontend: React + Vite + TailwindCSS

BD Principal: PostgreSQL

Auditoría: MongoDB

Notificaciones: SMTP (Nodemailer)

Infra Local: Docker Compose

Este README explica cómo ejecutar todo en LOCAL después de clonar el repositorio.


## Instalación

### Clonar el repositorio

```bash
git clone https://github.com/usuario/flujo-aprobaciones.git
cd flujo-aprobaciones
```
### Levantar bases de datos con Docker

El proyecto incluye un docker-compose.yml con:

PostgreSQL

MongoDB

Ejecuta:   

```bash
docker compose up -d
```

## Servicios

- PostgreSQL 5432 Base de datos principal
- MongoDB 27017 Auditoría y trazabilidad

Comprobar 

```bash
docker ps
```
## Crear archivos .env (No incluidos en el repo)

Por seguridad, los .env NO están incluidos.
Debes crearlos manualmente:

## Backend - backend/.env

```bash
DATABASE_URL=postgresql://app_user:app_password@localhost:5432/aprobaciones_db?schema=public
MONGO_URL=mongodb://admin:admin123@localhost:27017/aprobaciones_history?authSource=admin
MONGO_DB_NAME=approvals_db
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=TU_CORREO@gmail.com
MAIL_PASS=TU_CONTRASEÑA_DE_APLICACION
MAIL_FROM="Flujo de Aprobaciones <TU_CORREO@gmail.com>"
```
## Frontend — frontend/.env

Crear archivo:

```bash
VITE_API_URL=http://localhost:4000
```
## Instalar dependencias

### Backend

```bash
cd backend
npm install
```
### Frontend

```bash
cd ../frontend
npm install
```
## Ejecutar migraciones y seed

Volver al backend:

```bash
cd ../backend
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
```
Esto:

- Crea tablas en PostgreSQL

- Inserta usuarios y tipos de solicitud

- Carga solicitudes de ejemplo

- Sincroniza el historial en Mongo

## Ejecutar Backend y Frontend
### Backend
```bash
cd backend
npm run dev
```
### Frontend

En otra terminal:

```bash
cd frontend
npm run dev
```
