import { apiGet } from './apiClient';
import type { HistoryEvent, RequestHistoryAction } from '../types/history';

export interface HistoryFilters {
  actorId?: string;
  action?: RequestHistoryAction;
  from?: string; // ISO date (yyyy-mm-dd)
  to?: string; // ISO date (yyyy-mm-dd)
}

export async function fetchHistory(
  filters: HistoryFilters = {}
): Promise<HistoryEvent[]> {
  const params = new URLSearchParams();

  if (filters.actorId && filters.actorId.trim() !== '') {
    params.set('actorId', filters.actorId.trim());
  }

  if (filters.action) {
    params.set('action', filters.action);
  }

  if (filters.from) {
    params.set('from', filters.from);
  }

  if (filters.to) {
    params.set('to', filters.to);
  }

  const query = params.toString();
  const path = `/api/history${query ? `?${query}` : ''}`;

  return apiGet<HistoryEvent[]>(path);
}
