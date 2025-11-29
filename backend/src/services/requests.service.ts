import { prisma } from "../prisma/client";
import type { CreateRequestDto } from "../dto/createRequest.dto";
import { RequestStatus } from "@prisma/client";
import {sendNewRequestNotificationEmail, sendRequestStatusChangeEmail} from "./email.service";

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

export async function getRequests(params: {
    applicantId?: number;
    responsibleId?: number;
}) {
    const { applicantId, responsibleId } = params;

    const where: any = {};

    if (typeof applicantId === "number") {
        where.applicantId = applicantId;
    }

    if (typeof responsibleId === "number") {
        where.responsibleId = responsibleId;
    }

    return prisma.request.findMany({
        where,
        orderBy: {
            createdAt: "desc",
        },
        include: {
            requestType: true,
            applicant: true,
            responsible: true,
            history: {
                orderBy: { createdAt: "asc" },
            },
        },
    });
}

export async function getRequestById(id: number) {
    const request = await prisma.request.findUnique({
        where: { id },
        include: {
            requestType: true,
            applicant: true,
            responsible: true,
            history: {
                orderBy: { createdAt: "asc" },
                include: {
                    actor: true,
                },
            },
        },
    });

    return request;
}

export async function changeRequestStatus(params: {
    requestId: number;
    actorId: number;
    targetStatus: RequestStatus;
    comment?: string;
}) {
    const { requestId, actorId, targetStatus, comment } = params;
    const request = await prisma.request.findUnique({
        where: { id: requestId },
        include: {
            applicant: true,
            responsible: true,
        },
    });

    if (!request) {
        throw new Error("La solicitud no existe");
    }

    if (request.status !== RequestStatus.PENDIENTE) {
        throw new Error("Solo se pueden procesar solicitudes en estado PENDIENTE");
    }
    if (actorId !== request.responsibleId) {
        throw new Error("Solo el responsable asignado puede cambiar el estado");
    }

    const updated = await prisma.request.update({
        where: { id: requestId },
        data: {
            status: targetStatus,
            history: {
                create: {
                    actorId,
                    previousStatus: request.status,
                    newStatus: targetStatus,
                    comment: comment && comment.trim().length > 0 ? comment : null,
                },
            },
        },
        include: {
            requestType: true,
            applicant: true,
            responsible: true,
            history: {
                orderBy: { createdAt: "asc" },
                include: {
                    actor: true,
                },
            },
        },
    });

    await sendRequestStatusChangeEmail({
        request: updated,
        applicant: updated.applicant,
        responsible: updated.responsible,
        actorId,
        comment,
    });

    return updated;
}