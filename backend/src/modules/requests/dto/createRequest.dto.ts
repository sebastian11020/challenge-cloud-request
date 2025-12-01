export interface CreateRequestDto {
    title: string;
    description: string;
    requestTypeId: number;
    applicantId: number;
    responsibleId: number;
    comment?: string;
}

export class CreateRequestValidationError extends Error {
    statusCode = 400;
    constructor(message: string) {
        super(message);
        this.name = "CreateRequestValidationError";
    }
}

export function parseCreateRequestDto(body: unknown): CreateRequestDto {
    if (typeof body !== "object" || body === null) {
        throw new CreateRequestValidationError("El cuerpo de la petición debe ser un objeto");
    }

    const {
        title,
        description,
        requestTypeId,
        applicantId,
        responsibleId,
        comment,
    } = body as Record<string, unknown>;

    if (typeof title !== "string" || title.trim().length === 0) {
        throw new CreateRequestValidationError("El título es obligatorio");
    }

    if (typeof description !== "string" || description.trim().length === 0) {
        throw new CreateRequestValidationError("La descripción es obligatoria");
    }

    if (
        typeof requestTypeId !== "number" ||
        !Number.isInteger(requestTypeId)
    ) {
        throw new CreateRequestValidationError(
            "El tipo de solicitud (requestTypeId) es obligatorio y debe ser numérico"
        );
    }

    if (typeof applicantId !== "number" || !Number.isInteger(applicantId)) {
        throw new CreateRequestValidationError(
            "El solicitante (applicantId) es obligatorio y debe ser numérico"
        );
    }

    if (typeof responsibleId !== "number" || !Number.isInteger(responsibleId)) {
        throw new CreateRequestValidationError(
            "El responsable (responsibleId) es obligatorio y debe ser numérico"
        );
    }

    if (comment !== undefined && typeof comment !== "string") {
        throw new CreateRequestValidationError("El comentario debe ser una cadena de texto");
    }

    return {
        title: title.trim(),
        description: description.trim(),
        requestTypeId,
        applicantId,
        responsibleId,
        comment: comment ? (comment as string).trim() : undefined,
    };
}
