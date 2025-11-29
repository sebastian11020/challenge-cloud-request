import { prisma } from "../prisma/client";
import type { CreateRequestDto } from "../dto/createRequest.dto";
import { RequestStatus } from "@prisma/client";
import { sendNewRequestNotificationEmail } from "./email.service";

export async function createRequest(input: CreateRequestDto) {
    const {
        title,
        description,
        requestTypeId,
        applicantId,
        responsibleId,
        comment,
    } = input;

    const [applicant, responsible, requestType] = await Promise.all([
        prisma.user.findUnique({ where: { id: applicantId } }),
        prisma.user.findUnique({ where: { id: responsibleId } }),
        prisma.requestType.findUnique({ where: { id: requestTypeId } }),
    ]);

    if (!applicant) {
        throw new Error("El solicitante no existe");
    }

    if (!responsible) {
        throw new Error("El responsable no existe");
    }

    if (!requestType || !requestType.active) {
        throw new Error("El tipo de solicitud no existe o está inactivo");
    }

    const timestamp = Date.now();
    const publicId = `REQ-${timestamp}`;

    const request = await prisma.request.create({
        data: {
            publicId,
            title,
            description,
            status: RequestStatus.PENDIENTE,
            requestTypeId,
            applicantId,
            responsibleId,
            history: {
                create: {
                    actorId: applicantId,
                    previousStatus: null,
                    newStatus: RequestStatus.PENDIENTE,
                    comment: comment && comment.trim().length > 0 ? comment : null,
                },
            },
        },
        include: {
            applicant: true,
            responsible: true,
            requestType: true,
            history: {
                orderBy: { createdAt: "asc" },
                include: {
                    actor: true,
                },
            },
        },
    });

    await sendNewRequestNotificationEmail({
        request,
        applicant,
        responsible,
    });

    return request;
}
