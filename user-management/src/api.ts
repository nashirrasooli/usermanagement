import axios from 'axios';
import type { User, UserRequest } from './types';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
});

export const listUsers = async (): Promise<User[]> =>
  (await api.get<User[]>('/users')).data;

export const createUser = async (payload: UserRequest): Promise<User> =>
  (await api.post<User>('/users', payload)).data;

export const updateUser = async (id: string, payload: UserRequest): Promise<User> =>
  (await api.put<User>(`/users/${id}`, payload)).data;

export const deleteUser = async (id: string): Promise<void> =>
  (await api.delete(`/users/${id}`)).data;
