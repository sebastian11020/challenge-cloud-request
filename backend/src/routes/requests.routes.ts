import { Router } from "express";
import { createRequest } from "../services/requests.service";
import {
    parseCreateRequestDto,
    CreateRequestValidationError,
} from "../dto/createRequest.dto";

const router = Router();

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
