export interface CreateRequestTypeDto {
    code: string;
    name: string;
    description?: string;
}

export interface UpdateRequestTypeDto {
    name?: string;
    description?: string;
    active?: boolean;
}

export class RequestTypeValidationError extends Error {
    statusCode = 400;

    constructor(message: string) {
        super(message);
        this.name = "RequestTypeValidationError";
    }
}

export function parseCreateRequestTypeDto(body: unknown): CreateRequestTypeDto {
    if (typeof body !== "object" || body === null) {
        throw new RequestTypeValidationError(
            "El cuerpo de la petición debe ser un objeto"
        );
    }

    const { code, name, description } = body as {
        code?: unknown;
        name?: unknown;
        description?: unknown;
    };

    if (typeof code !== "string" || code.trim().length === 0) {
        throw new RequestTypeValidationError("code es obligatorio y debe ser texto");
    }

    if (typeof name !== "string" || name.trim().length === 0) {
        throw new RequestTypeValidationError("name es obligatorio y debe ser texto");
    }

    if (description !== undefined && typeof description !== "string") {
        throw new RequestTypeValidationError(
            "description debe ser una cadena de texto"
        );
    }

    return {
        code: code.trim(),
        name: name.trim(),
        description: description ? (description as string).trim() : undefined,
    };
}

export function parseUpdateRequestTypeDto(body: unknown): UpdateRequestTypeDto {
    if (typeof body !== "object" || body === null) {
        throw new RequestTypeValidationError(
            "El cuerpo de la petición debe ser un objeto"
        );
    }

    const { name, description, active } = body as {
        name?: unknown;
        description?: unknown;
        active?: unknown;
    };

    const dto: UpdateRequestTypeDto = {};

    if (name !== undefined) {
        if (typeof name !== "string" || name.trim().length === 0) {
            throw new RequestTypeValidationError(
                "name debe ser texto si se envía"
            );
        }
        dto.name = name.trim();
    }

    if (description !== undefined) {
        if (typeof description !== "string") {
            throw new RequestTypeValidationError(
                "description debe ser texto si se envía"
            );
        }
        dto.description = (description as string).trim();
    }

    if (active !== undefined) {
        if (typeof active !== "boolean") {
            throw new RequestTypeValidationError(
                "active debe ser booleano si se envía"
            );
        }
        dto.active = active;
    }

    return dto;
}
