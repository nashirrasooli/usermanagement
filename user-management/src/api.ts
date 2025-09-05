import axios from 'axios';
import type { UserRequest } from './types';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});



// export const listUsers = async (): Promise<User[]> =>
//   (await api.get<User[]>('/users')).data;

// export const createUser = async (payload: UserRequest): Promise<User> =>
//   (await api.post<User>('/users', payload)).data;

// add these if you don't have them yet
export type User = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ADMIN' | 'USER';
  enabled: boolean;
  // backend may ignore password on update if empty
  password?: string;
};

export const getUser = (id: string) => api.get(`/users/${id}`).then(r => r.data as User);


export const listUsers = () => api.get('/users').then(r => r.data);
export const createUser = (p: any) => api.post('/users', p).then(r => r.data);
// ... etc


export const updateUser = async (id: string, payload: UserRequest): Promise<User> =>
  (await api.put<User>(`/users/${id}`, payload)).data;

export const deleteUser = async (id: string): Promise<void> =>
  (await api.delete(`/users/${id}`)).data;
