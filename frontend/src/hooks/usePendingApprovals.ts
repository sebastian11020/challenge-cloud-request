import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export function usePendingApprovals(userId?: number) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/api/requests?responsibleId=${userId}`);
        const data = await res.json();
        const pending = data.filter((r: any) => r.status === 'PENDIENTE');

        setCount(pending.length);
      } catch (err) {
        console.error('Error cargando solicitudes pendientes', err);
      }
    };

    load();
  }, [userId]);

  return count;
}
