Flujo de Aprobaciones — Ejecución en Local

Este documento explica cómo ejecutar el proyecto completo en ambiente local después de clonar el repositorio.
El sistema incluye:

Frontend: React + Vite + Tailwind

Backend: Node.js + Express + Prisma

Base de datos principal: PostgreSQL

Auditoría: MongoDB

Notificaciones por correo con Nodemailer

Todo preparado para ejecutarse con Docker y Node.js.

📦 1. Clonar el repositorio
git clone https://github.com/usuario/flujo-aprobaciones.git
cd flujo-aprobaciones

🐳 2. Levantar bases de datos con Docker

En la raíz del proyecto encontrarás un docker-compose.yml que inicia:

PostgreSQL (base de datos principal)

MongoDB (auditoría de historial)

Ejecuta:

docker compose up -d


Esto levantará:

Servicio	Puerto	Descripción
PostgreSQL	5432	Base de datos principal
MongoDB	27017	Historial de auditoría

Verificar que están activos:

docker ps

🔐 3. Crear variables de entorno

Los archivos .env NO están incluidos en el repositorio por seguridad.
Debes crearlos manualmente siguiendo las instrucciones:

📌 3.1 Backend — Crear archivo: backend/.env

Dentro de la carpeta backend, crea un archivo:

DATABASE_URL=postgresql://app_user:app_password@localhost:5432/aprobaciones_db?schema=public

MONGO_URL=mongodb://admin:admin123@localhost:27017/aprobaciones_history?authSource=admin

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=TU_CORREO@gmail.com
MAIL_PASS=TU_CONTRASEÑA_DE_APLICACION
MAIL_FROM="Flujo de Aprobaciones <TU_CORREO@gmail.com>"


Notas:

Los usuarios/contraseñas de Postgres y Mongo ya están configurados en docker-compose.yml.

Para Gmail necesitas una contraseña de aplicación, no la contraseña normal.

📌 3.2 Frontend — Crear archivo: frontend/.env

Dentro de la carpeta frontend, crea:

VITE_API_URL=http://localhost:4000

📦 4. Instalar dependencias
Backend
cd backend
npm install

Frontend
cd ../frontend
npm install

🗄 5. Ejecutar migraciones y seed

Regresa a la carpeta del backend:

cd ../backend
npx prisma migrate deploy
npx prisma db seed


Esto:

Crea tablas en PostgreSQL

Inserta usuarios, tipos de solicitud y solicitudes de ejemplo

Sincroniza historial en Mongo

▶️ 6. Ejecutar Backend y Frontend
Backend
cd backend
npm run dev


Se inicia en:
➡ http://localhost:4000

Frontend

En otra terminal:

cd frontend
npm run dev


Se inicia en:
➡ http://localhost:5173

🎉 7. Abrir la aplicación

👉 Abre en el navegador:

http://localhost:5173

Desde aquí podrás:

Crear solicitudes

Asignar responsables

Aprobar / rechazar

Ver historial en tiempo real

Ver estadísticas

Probar envío de correos

🧪 8. Pruebas recomendadas

Crear solicitudes con distintos tipos

Usar diferentes roles (Solicitante / Aprobador / Admin)

Cambiar estados

Consultar historial completo (Mongo + Prisma)

Validar persistencia reiniciando contenedores (docker compose down + up)
