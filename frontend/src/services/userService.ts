import type { User } from '../types/user';
import { apiGet } from './apiClient';

export async function getUsers(): Promise<User[]> {
  return apiGet<User[]>('/api/users');
}
