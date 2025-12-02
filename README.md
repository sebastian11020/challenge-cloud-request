# Flujo de Aprobaciones – Ejecución Local

Bienvenido.
Este repositorio contiene un sistema completo de gestión de solicitudes y flujo de aprobaciones, compuesto por:

Backend: Node.js + Express + Prisma

Frontend: React + Vite + TailwindCSS

Base de Datos Principal: PostgreSQL

Auditoría: MongoDB

Notificaciones Email: SMTP (Nodemailer)

Infraestructura Local: Docker Compose

Este documento explica cómo ejecutar TODO el sistema en local después de clonar el repositorio.

## Requisitos Previos

Asegúrate de tener instalado:
- Docker

## Instalación

### Clonar el repositorio

```bash
git clone https://github.com/sebastian11020/challenge-cloud-request.git
```
### Configurar credenciales SMTP

El backend usa Nodemailer para enviar correos.
Debes agregar tus credenciales de correo en el docker-compose.yml:

```bash
MAIL_HOST: smtp.gmail.com
MAIL_PORT: 587
MAIL_USER: TU_CORREO@gmail.com
MAIL_PASS: TU_CONTRASEÑA_DE_APLICACION
MAIL_FROM: "Flujo de Aprobaciones <TU_CORREO@gmail.com>"
```
## IMPORTANTE:
Si usas Gmail, debes generar una Contraseña de Aplicación desde
Google → Seguridad → Verificación en dos pasos → Contraseñas de aplicación.

### Levantar el proyecto (Backend, Frontend, PostgreSQL y MongoDB)
```bash
docker compose up -d
```
Esto levantará:
- PostgreSQL → puerto 5432
- MongoDB → puerto 27017
- Backend → puerto 4000
- Frontend → expuesto en el puerto 80
Verifica que los servicios están arriba:
```bash
docker ps
```
### Acceder al sistema
Una vez todo esté levantado, abre en tu navegador:
```bash
http://localhost
```
