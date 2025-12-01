import type { Request, Response, NextFunction } from "express";
import {
    getRequestTypes,
    createRequestType,
    updateRequestType,
} from "./requestTypes.service";
import {
    parseCreateRequestTypeDto,
    parseUpdateRequestTypeDto,
    RequestTypeValidationError,
} from "./dto/requestTypes.dto";

export const listRequestTypes = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const types = await getRequestTypes();
        return res.json(types);
    } catch (err) {
        console.error("Error al obtener tipos de solicitud:", err);
        return next(err);
    }
};

export const createRequestTypeHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const dto = parseCreateRequestTypeDto(req.body);
        const type = await createRequestType(dto);
        return res.status(201).json(type);
    } catch (err: any) {
        if (err instanceof RequestTypeValidationError) {
            return res.status(err.statusCode).json({ message: err.message });
        }

        console.error("Error al crear tipo de solicitud:", err);
        return next(err);
    }
};

export const updateRequestTypeHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ message: "ID inválido" });
        }

        const dto = parseUpdateRequestTypeDto(req.body);
        const type = await updateRequestType(id, dto);
        return res.json(type);
    } catch (err: any) {
        if (err instanceof RequestTypeValidationError) {
            return res.status(err.statusCode).json({ message: err.message });
        }

        console.error("Error al actualizar tipo de solicitud:", err);
        return next(err);
    }
};
