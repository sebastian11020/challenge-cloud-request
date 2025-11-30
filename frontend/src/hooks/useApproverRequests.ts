import { useCallback, useEffect, useMemo, useState } from 'react';
import type { RequestSummary } from '../types/request';
import { getApproverRequests } from '../services/requestService';

interface UseApproverRequestsResult {
  requests: RequestSummary[];
  pending: RequestSummary[];
  history: RequestSummary[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

export function useApproverRequests(responsibleId?: number): UseApproverRequestsResult {
  const [requests, setRequests] = useState<RequestSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!responsibleId) return;

    try {
      setLoading(true);
      setError(null);

      const data = await getApproverRequests({ responsibleId });
      setRequests(data);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message ??
          'No se pudieron cargar las solicitudes asignadas. Intenta nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  }, [responsibleId]);

  useEffect(() => {
    void load();
  }, [load]);

  const pending = useMemo(
    () => requests.filter((r) => r.status === 'PENDIENTE'),
    [requests]
  );

  const history = useMemo(
    () => requests.filter((r) => r.status !== 'PENDIENTE'),
    [requests]
  );

  return {
    requests,
    pending,
    history,
    loading,
    error,
    reload: load,
  };
}
