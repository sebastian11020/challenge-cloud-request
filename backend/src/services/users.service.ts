import { prisma } from "../prisma/client";

export async function getAllUsers() {
    return prisma.user.findMany({
        orderBy: { id: "asc" },
    });
}
