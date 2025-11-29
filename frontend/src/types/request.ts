import type { User } from "./user";
import type { RequestType } from "./requestType";

export type RequestStatus = "PENDIENTE" | "APROBADA" | "RECHAZADA";

export interface RequestHistoryEntry {
    id: number;
    previousStatus: RequestStatus | null;
    newStatus: RequestStatus;
    comment: string | null;
    createdAt: string;
    actor: User;
}

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

export interface RequestDetail extends RequestSummary {
    description: string;
    history: RequestHistoryEntry[];
}
