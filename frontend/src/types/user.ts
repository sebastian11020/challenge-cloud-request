export type UserRole = 'SOLICITANTE' | 'APROBADOR' | 'ADMIN';

export interface User {
  id: number;
  username: string;
  displayName: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}
