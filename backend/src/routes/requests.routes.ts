import { Router } from "express";
import {createRequest, getRequests} from "../services/requests.service";
import {
    parseCreateRequestDto,
    CreateRequestValidationError,
} from "../dto/createRequest.dto";

const router = Router();

router.get("/", async (req, res) => {
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
            return res
                .status(400)
                .json({ message: "Parámetros de filtro inválidos" });
        }

        const requests = await getRequests({
            applicantId: parsedApplicantId,
            responsibleId: parsedResponsibleId,
        });

        return res.json(requests);
    } catch (error) {
        console.error("Error al obtener solicitudes:", error);
        return res
            .status(500)
            .json({ message: "Error al obtener las solicitudes" });
    }
});


router.post("/", async (req, res) => {
    try {
        const dto = parseCreateRequestDto(req.body);
        const request = await createRequest(dto);
        return res.status(201).json(request);
    } catch (error: any) {
        if (error instanceof CreateRequestValidationError) {
            return res.status(error.statusCode).json({ message: error.message });
        }

        console.error("Error al crear solicitud:", error);
        return res.status(500).json({
            message: error?.message ?? "Error al crear la solicitud",
        });
    }
});

export default router;
