import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg"; // ✅

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
            displayName: "Sebastián Daza",
            role: "SOLICITANTE" as const,
        },
        {
            username: "ana.aprobadora",
            displayName: "Ana Aprobadora",
            role: "APROBADOR" as const,
        },
        {
            username: "admin.coordinador",
            displayName: "Admin Coordinador",
            role: "ADMIN" as const,
        },
    ];

    for (const data of usersData) {
        await prisma.user.upsert({
            where: { username: data.username },
            update: {},
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
