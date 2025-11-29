import type { RequestType } from "./requestType";
import type { User } from "./user";

export type RequestStatus = "PENDIENTE" | "APROBADA" | "RECHAZADA";

export interface RequestSummary {
    id: number;
    publicId: string;
    title: string;
    status: RequestStatus;
    createdAt: string;
    requestType: RequestType;
    applicant: User;
    responsible: User;
}
