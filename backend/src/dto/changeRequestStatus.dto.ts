export type TargetStatusDto = "APROBADA" | "RECHAZADA";

export interface ChangeRequestStatusDto {
    actorId: number;
    comment?: string;
    targetStatus: TargetStatusDto;
}

export class ChangeRequestStatusValidationError extends Error {
    statusCode = 400;

    constructor(message: string) {
        super(message);
        this.name = "ChangeRequestStatusValidationError";
    }
}

export function parseChangeRequestStatusDto(
    body: unknown,
    targetStatus: TargetStatusDto
): ChangeRequestStatusDto {
    if (typeof body !== "object" || body === null) {
        throw new ChangeRequestStatusValidationError(
            "El cuerpo de la petición debe ser un objeto"
        );
    }

    const { actorId, comment } = body as Record<string, unknown>;

    if (typeof actorId !== "number" || !Number.isInteger(actorId)) {
        throw new ChangeRequestStatusValidationError(
            "actorId es obligatorio y debe ser numérico"
        );
    }

    if (comment !== undefined && typeof comment !== "string") {
        throw new ChangeRequestStatusValidationError(
            "El comentario debe ser una cadena de texto"
        );
    }

    return {
        actorId,
        targetStatus,
        comment: comment ? (comment as string).trim() : undefined,
    };
}
