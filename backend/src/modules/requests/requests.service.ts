import { prisma } from "../../db/prisma";
import type { CreateRequestDto } from "./dto/createRequest.dto";
import { RequestStatus } from "@prisma/client";
import {
    sendNewRequestNotificationEmail,
    sendRequestStatusChangeEmail,
} from "../../shared/email/email.service";
import { logRequestEvent } from "../history/history.service";

interface RequestStatsFilters {
    applicantId?: number;
    responsibleId?: number;
}

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
            // historial relacional (Prisma)
            history: {
                create: {
                    actorId: applicantId,
                    previousStatus: null,
                    newStatus: RequestStatus.PENDIENTE,
                    comment:
                        comment && comment.trim().length > 0 ? comment : null,
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

    const applicantIdentifier =
        (applicant as any).email ??
        (applicant as any).username ??
        `user-${applicant.id}`;
    await logRequestEvent({
        requestId: request.id,
        action: "CREATED",
        previousStatus: null,
        newStatus: request.status, // RequestStatus.PENDIENTE
        actorId: applicant.id,
        actor: applicantIdentifier,
        role: "SOLICITANTE",
        comment: comment && comment.trim().length > 0 ? comment : null,
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

// 🔍 Buscar por id interno o por publicId (REQ-...)
export async function findRequestByIdOrPublicId(identifier: string) {
    const numericId = Number(identifier);

    // 1) Intentar como id numérico
    if (!Number.isNaN(numericId)) {
        const byId = await prisma.request.findUnique({
            where: { id: numericId },
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

        if (byId) {
            return byId;
        }
    }

    // 2) Intentar como publicId
    const byPublicId = await prisma.request.findUnique({
        where: { publicId: identifier },
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

    return byPublicId;
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
        throw new Error(
            "Solo se pueden procesar solicitudes en estado PENDIENTE"
        );
    }

    if (actorId !== request.responsibleId) {
        throw new Error(
            "Solo el responsable asignado puede cambiar el estado"
        );
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
                    comment:
                        comment && comment.trim().length > 0 ? comment : null,
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

    const actorUser = updated.responsible;
    const actorIdentifier =
        (actorUser as any).email ??
        (actorUser as any).username ??
        `user-${actorUser.id}`;

    await logRequestEvent({
        requestId: updated.id,
        action: "STATUS_CHANGED",
        previousStatus: request.status,
        newStatus: updated.status,
        actorId,
        actor: actorIdentifier,
        role: "RESPONSABLE", // si más adelante tienes rol APROBADOR puedes ajustarlo aquí
        comment: comment && comment.trim().length > 0 ? comment : null,
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

export async function getRequestsStats(filters: RequestStatsFilters = {}) {
    const { applicantId, responsibleId } = filters;

    console.log("📊 getRequestsStats() filters:", filters);

    const where: any = {};

    if (applicantId !== undefined) {
        where.applicantId = applicantId;
    }

    if (responsibleId !== undefined) {
        where.responsibleId = responsibleId;
    }

    console.log("📊 getRequestsStats() where:", where);

    const [total, pending, approved, rejected] = await Promise.all([
        prisma.request.count({ where }),
        prisma.request.count({ where: { ...where, status: RequestStatus.PENDIENTE } }),
        prisma.request.count({ where: { ...where, status: RequestStatus.APROBADA } }),
        prisma.request.count({ where: { ...where, status: RequestStatus.RECHAZADA } }),
    ]);

    console.log("📊 getRequestsStats() result:", { total, pending, approved, rejected });

    return {
        total,
        pending,
        approved,
        rejected,
    };
}

