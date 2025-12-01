import { Request, Response } from "express";
import { RequestStatus } from "@prisma/client";
import {
    createRequest,
    getRequests,
    findRequestByIdOrPublicId,
    changeRequestStatus,
    getRequestsStats,
} from "./requests.service";
import {
    parseCreateRequestDto,
    CreateRequestValidationError,
} from "./dto/createRequest.dto";
import {
    parseChangeRequestStatusDto,
    ChangeRequestStatusValidationError,
} from "./dto/changeRequestStatus.dto";

export const listRequests = async (req: Request, res: Response) => {
    try {
        const { applicantId, responsibleId } = req.query;

        const parsedApplicantId =
            typeof applicantId === "string" && applicantId.trim() !== ""
                ? Number(applicantId)
                : undefined;

        const parsedResponsibleId =
            typeof responsibleId === "string" && responsibleId.trim() !== ""
                ? Number(responsibleId)
                : undefined;

        if (
            (parsedApplicantId !== undefined && Number.isNaN(parsedApplicantId)) ||
            (parsedResponsibleId !== undefined && Number.isNaN(parsedResponsibleId))
        ) {
            return res.status(400).json({ message: "Parámetros de filtro inválidos" });
        }

        const requests = await getRequests({
            applicantId: parsedApplicantId,
            responsibleId: parsedResponsibleId,
        });

        return res.json(requests);
    } catch (error) {
        console.error("Error al obtener solicitudes:", error);
        return res.status(500).json({ message: "Error al obtener las solicitudes" });
    }
};

export const getStats = async (req: Request, res: Response) => {
    try {
        const { applicantId, responsibleId } = req.query;

        const parsedApplicantId =
            typeof applicantId === "string" && applicantId.trim() !== ""
                ? Number(applicantId)
                : undefined;

        const parsedResponsibleId =
            typeof responsibleId === "string" && responsibleId.trim() !== ""
                ? Number(responsibleId)
                : undefined;

        if (
            (parsedApplicantId !== undefined && Number.isNaN(parsedApplicantId)) ||
            (parsedResponsibleId !== undefined && Number.isNaN(parsedResponsibleId))
        ) {
            return res.status(400).json({ message: "Parámetros de filtro inválidos" });
        }

        const stats = await getRequestsStats({
            applicantId: parsedApplicantId,
            responsibleId: parsedResponsibleId,
        });

        return res.json(stats);
    } catch (error) {
        console.error("Error al obtener estadísticas de solicitudes:", error);
        return res
            .status(500)
            .json({ message: "Error al obtener las estadísticas" });
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        const dto = parseCreateRequestDto(req.body);
        const request = await createRequest(dto);
        return res.status(201).json(request);
    } catch (error: any) {
        if (error instanceof CreateRequestValidationError) {
            return res.status(error.statusCode).json({ message: error.message });
        }

        console.error("Error al crear solicitud:", error);
        return res
            .status(500)
            .json({ message: error?.message ?? "Error al crear la solicitud" });
    }
};

export const getByIdentifier = async (req: Request, res: Response) => {
    try {
        const { identifier } = req.params;
        const request = await findRequestByIdOrPublicId(identifier);

        if (!request) {
            return res.status(404).json({ message: "Solicitud no encontrada" });
        }

        return res.json(request);
    } catch (error) {
        console.error("Error al obtener una solicitud:", error);
        return res
            .status(500)
            .json({ message: "Error al obtener la solicitud" });
    }
};

export const approve = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({ message: "ID inválido" });
        }

        const dto = parseChangeRequestStatusDto(req.body, "APROBADA");

        const updated = await changeRequestStatus({
            requestId: id,
            actorId: dto.actorId,
            targetStatus: RequestStatus.APROBADA,
            comment: dto.comment,
        });

        return res.json(updated);
    } catch (error: any) {
        if (error instanceof ChangeRequestStatusValidationError) {
            return res.status(error.statusCode).json({ message: error.message });
        }

        console.error("Error al aprobar solicitud:", error);
        return res
            .status(500)
            .json({ message: error?.message ?? "Error al aprobar la solicitud" });
    }
};

export const reject = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({ message: "ID inválido" });
        }

        const dto = parseChangeRequestStatusDto(req.body, "RECHAZADA");

        const updated = await changeRequestStatus({
            requestId: id,
            actorId: dto.actorId,
            targetStatus: RequestStatus.RECHAZADA,
            comment: dto.comment,
        });

        return res.json(updated);
    } catch (error: any) {
        if (error instanceof ChangeRequestStatusValidationError) {
            return res.status(error.statusCode).json({ message: error.message });
        }

        console.error("Error al rechazar solicitud:", error);
        return res
            .status(500)
            .json({ message: error?.message ?? "Error al rechazar la solicitud" });
    }
};
