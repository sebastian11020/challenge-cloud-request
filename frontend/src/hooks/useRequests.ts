import { useEffect, useState } from 'react';
import { getMyRequests } from '../services/requestService';
import type { RequestSummary } from '../types/request';

type RequestParams = {
  applicantId?: number;
  responsibleId?: number;
} | null;

export function useRequests(rawParams: RequestParams) {
  const [requests, setRequests] = useState<RequestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔥 Normalizamos el input para evitar que lleguen números sueltos
  const params =
    typeof rawParams === 'number'
      ? { applicantId: rawParams } // si llega un número, lo tratamos como solicitante
      : rawParams || {}; // si llega null/undefined, lo ponemos como {}

  const applicantId =
    typeof params === 'object' && 'applicantId' in params
      ? params.applicantId
      : undefined;

  const responsibleId =
    typeof params === 'object' && 'responsibleId' in params
      ? params.responsibleId
      : undefined;

  useEffect(() => {
    // Nada que cargar si no hay valores
    if (!applicantId && !responsibleId) {
      setRequests([]);
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getMyRequests({
          applicantId,
          responsibleId,
        });

        setRequests(data);
      } catch (err: any) {
        setError(err?.message || 'Error al cargar solicitudes.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [applicantId, responsibleId]);

  return { requests, loading, error };
}
