export type RequestHistoryAction = 'CREATED' | 'STATUS_CHANGED';

export type RequestHistoryRole = 'SOLICITANTE' | 'RESPONSABLE' | 'APROBADOR' | 'ADMIN';

export interface HistoryEvent {
  _id?: string;
  requestId: number;
  action: RequestHistoryAction;
  previousStatus: string | null;
  newStatus: string;
  actorId: number;
  actor: string;
  role: RequestHistoryRole;
  comment?: string | null;
  createdAt: string;
}
