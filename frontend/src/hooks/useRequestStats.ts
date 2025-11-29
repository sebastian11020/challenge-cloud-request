import { useEffect, useState } from "react";
import { getRequestStats, type RequestStats } from "../services/requestService";

export interface RequestStatsParams {
    applicantId?: number;
    responsibleId?: number;
}

interface UseRequestStatsResult {
    stats: RequestStats | null;
    loading: boolean;
    error: string | null;
}

export function useRequestStats(params?: RequestStatsParams): UseRequestStatsResult {
    const [stats, setStats] = useState<RequestStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadStats = async () => {
            try {
                setError(null);
                setLoading(true);

                const data = await getRequestStats(params);
                setStats(data);
            } catch (err) {
                console.error(err);
                setError("No se pudieron obtener las estadísticas.");
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, [params?.applicantId, params?.responsibleId]);

    return { stats, loading, error };
}
