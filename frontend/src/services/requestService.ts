import { apiGet, apiPost } from "./apiClient";
import type { RequestSummary, RequestDetail } from "../types/request";

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

export async function getRequestDetail(
    idOrPublicId: string | number
): Promise<RequestDetail> {
    const path = `/api/requests/${idOrPublicId}`;
    return apiGet<RequestDetail>(path);
}

export async function changeRequestStatusApi(params: {
    requestId: number;
    target: "approve" | "reject";
    actorId: number;
    comment?: string;
}): Promise<RequestDetail> {
    const { requestId, target, actorId, comment } = params;

    const path =
        target === "approve"
            ? `/api/requests/${requestId}/approve`
            : `/api/requests/${requestId}/reject`;

    return apiPost<RequestDetail>(path, {
        actorId,
        comment: comment?.trim() || undefined,
    });
}

export async function getApproverRequests(params: {
    responsibleId: number;
}): Promise<RequestSummary[]> {
    const searchParams = new URLSearchParams();
    searchParams.set("responsibleId", String(params.responsibleId));

    const path = `/api/requests?${searchParams.toString()}`;
    return apiGet<RequestSummary[]>(path);
}
