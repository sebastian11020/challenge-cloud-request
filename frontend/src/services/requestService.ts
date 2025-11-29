import { apiGet } from "./apiClient";

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
