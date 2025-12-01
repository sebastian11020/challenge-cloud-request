import { prisma } from "../../db/prisma";
import type {
    CreateRequestTypeDto,
    UpdateRequestTypeDto,
} from "./dto/requestTypes.dto";

export async function getRequestTypes() {
    return prisma.requestType.findMany({
        orderBy: { name: "asc" },
    });
}

export async function createRequestType(input: CreateRequestTypeDto) {
    const { code, name, description } = input;

    return prisma.requestType.create({
        data: {
            code,
            name,
            description,
            active: true,
        },
    });
}

export async function updateRequestType(
    id: number,
    data: UpdateRequestTypeDto
) {
    return prisma.requestType.update({
        where: { id },
        data,
    });
}
