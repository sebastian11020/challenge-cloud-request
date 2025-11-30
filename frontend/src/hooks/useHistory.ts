import { useCallback, useEffect, useState } from "react";
import type { HistoryEvent, RequestHistoryAction } from "../types/history";
import {
    fetchHistory,
    type HistoryFilters as ServiceHistoryFilters,
} from "../services/historyService";

export interface HistoryFilters {
    actorId: string;
    action: "" | RequestHistoryAction;
    from: string;
    to: string;
}

interface UseHistoryResult {
    events: HistoryEvent[];
    loading: boolean;
    error: string | null;
    reload: () => Promise<void>;
}

export function useHistory(appliedFilters: HistoryFilters): UseHistoryResult {
    const [events, setEvents] = useState<HistoryEvent[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const filtersForService: ServiceHistoryFilters = {
                actorId: appliedFilters.actorId || undefined,
                action: appliedFilters.action || undefined,
                from: appliedFilters.from || undefined,
                to: appliedFilters.to || undefined,
            };

            const data = await fetchHistory(filtersForService);
            setEvents(data);
        } catch (err: any) {
            console.error(err);
            setError(err?.message ?? "Error al cargar el historial");
        } finally {
            setLoading(false);
        }
    }, [
        appliedFilters.actorId,
        appliedFilters.action,
        appliedFilters.from,
        appliedFilters.to,
    ]);

    useEffect(() => {
        void load();
    }, [load]);

    return { events, loading, error, reload: load };
}
