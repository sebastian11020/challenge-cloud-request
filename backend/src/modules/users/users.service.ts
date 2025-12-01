import { prisma } from "../../db/prisma";

export async function getAllUsers() {
    return prisma.user.findMany({
        orderBy: { id: "asc" },
    });
}
