import type { RequestSummary } from "../types/request";

export const STATUS_STYLES: Record<RequestSummary["status"], string> = {
    PENDIENTE: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    APROBADA: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    RECHAZADA: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
};
