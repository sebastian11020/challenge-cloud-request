import { apiGet } from "./apiClient";
import type {RequestSummary} from "../types/request.ts";

export interface RequestStats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
}
export async function getRequestStats(params?: {
    applicantId?: number;
    responsibleId?: number;
}): Promise<RequestStats> {
    const searchParams = new URLSearchParams();

    if (params?.applicantId !== undefined) {
        searchParams.set("applicantId", String(params.applicantId));
    }

    if (params?.responsibleId !== undefined) {
        searchParams.set("responsibleId", String(params.responsibleId));
    }

    const query = searchParams.toString();
    const path = `/api/requests/stats${query ? `?${query}` : ""}`;

    return apiGet<RequestStats>(path);
}

export async function getMyRequests(params: {
    applicantId?: number;
    responsibleId?: number;
}): Promise<RequestSummary[]> {
    const searchParams = new URLSearchParams();

    if (params.applicantId !== undefined) {
        searchParams.set("applicantId", String(params.applicantId));
    }

    if (params.responsibleId !== undefined) {
        searchParams.set("responsibleId", String(params.responsibleId));
    }

    const query = searchParams.toString();
    const path = `/api/requests${query ? `?${query}` : ""}`;

    return apiGet<RequestSummary[]>(path);
}
