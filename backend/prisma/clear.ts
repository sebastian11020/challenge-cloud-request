import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🧹 Borrando datos...");

    await prisma.requestHistory.deleteMany({});
    await prisma.request.deleteMany({});
    await prisma.requestType.deleteMany({});
    await prisma.user.deleteMany({});

    console.log("✔️ Datos eliminados correctamente");
}

main()
    .catch((e) => {
        console.error("Error al borrar datos:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
