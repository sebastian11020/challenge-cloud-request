import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL no está definida en el entorno");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    const usersData = [
        {
            username: "sebastian.daza",
            email: "sebastiandd87@gmail.com",
            displayName: "Sebastián Daza",
            role: "SOLICITANTE" as const,
        },
        {
            username: "ana.aprobadora",
            email: "sebastiandaza792@gmail.com",
            displayName: "Ana Aprobadora",
            role: "APROBADOR" as const,
        },
        {
            username: "admin.coordinador",
            email: "admin.coordinador@example.com",
            displayName: "Admin Coordinador",
            role: "ADMIN" as const,
        },
    ];

    const requestTypesData = [
        {
            code: "DESPLIEGUE",
            name: "Despliegue",
            description: "Solicitud para despliegue de componentes o servicios.",
        },
        {
            code: "ACCESO",
            name: "Acceso",
            description: "Solicitud de creación o modificación de accesos.",
        },
        {
            code: "CAMBIO_TECNICO",
            name: "Cambio técnico",
            description: "Modificación técnica en sistemas o infraestructura.",
        },
        {
            code: "OTRO",
            name: "Otro",
            description: "Otros tipos de solicitud no categorizados.",
        },
    ];

    for (const data of requestTypesData) {
        await prisma.requestType.upsert({
            where: { code: data.code },
            update: {
                name: data.name,
                description: data.description,
                active: true,
            },
            create: data,
        });
    }

    console.log("Tipos de solicitud sembrados correctamente");


    for (const data of usersData) {
        await prisma.user.upsert({
            where: { username: data.username },
            update: {
                email: data.email,
                displayName: data.displayName,
                role: data.role,
            },
            create: data,
        });
    }

    console.log("Usuarios sembrados correctamente");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
