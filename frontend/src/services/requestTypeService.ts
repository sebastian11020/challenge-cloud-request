import type { RequestType } from '../types/requestType';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export interface CreateRequestTypeInput {
  code: string;
  name: string;
  description?: string;
}

export interface UpdateRequestTypeInput {
  name: string;
  description?: string;
  active: boolean;
}

export async function fetchRequestTypes(): Promise<RequestType[]> {
  const res = await fetch(`${API_URL}/api/request-types`);
  if (!res.ok) {
    throw new Error('Error al obtener tipos de solicitud');
  }
  return res.json() as Promise<RequestType[]>;
}

export async function createRequestType(payload: CreateRequestTypeInput): Promise<void> {
  const res = await fetch(`${API_URL}/api/request-types`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? 'Error al crear el tipo de solicitud');
  }
}

export async function updateRequestType(
  id: number,
  payload: UpdateRequestTypeInput
): Promise<void> {
  const res = await fetch(`${API_URL}/api/request-types/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? 'Error al actualizar el tipo de solicitud');
  }
}
