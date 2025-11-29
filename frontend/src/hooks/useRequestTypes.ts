import { useCallback, useEffect, useState } from "react";
import type { RequestType } from "../types/requestType";
import { fetchRequestTypes } from "../services/requestTypeService";

interface UseRequestTypesResult {
    types: RequestType[];
    loading: boolean;
    error: string | null;
    reload: () => Promise<void>;
}

export function useRequestTypes(): UseRequestTypesResult {
    const [types, setTypes] = useState<RequestType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchRequestTypes();
            setTypes(data);
        } catch (err: any) {
            console.error(err);
            setError(err?.message ?? "No se pudieron cargar los tipos de solicitud.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    return { types, loading, error, reload: load };
}
