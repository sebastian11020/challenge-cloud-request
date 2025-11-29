import { useEffect, useState, useCallback } from "react";
import { getRequestDetail } from "../services/requestService";
import type { RequestDetail } from "../types/request";

export function useRequestDetail(id?: string) {
    const [request, setRequest] = useState<RequestDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        if (!id) return;
        try {
            setLoading(true);
            setError(null);
            const data = await getRequestDetail(id);
            setRequest(data);
        } catch (err: any) {
            setError(err?.message ?? "No se pudo cargar la solicitud.");
            setRequest(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        void load();
    }, [load]);

    return { request, loading, error, setRequest, reload: load };
}
