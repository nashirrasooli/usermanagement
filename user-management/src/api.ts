
import axios from 'axios';
import type { UserRequest } from './types';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // keep consistent with authSlice
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('token');
      // optionally show a toast or notification
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// --- Types ---
export type User = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ADMIN' | 'USER';
  enabled: boolean;
  password?: string; // backend may ignore on update if empty
};

// --- API functions ---
export const getUser = (id: string): Promise<User> =>
  api.get(`/users/${id}`).then((r) => r.data as User);

export const listUsers = (): Promise<User[]> =>
  api.get('/users').then((r) => r.data);

export const createUser = (payload: UserRequest): Promise<User> =>
  api.post('/users', payload).then((r) => r.data);

export const updateUser = (id: string, payload: UserRequest): Promise<User> =>
  api.put(`/users/${id}`, payload).then((r) => r.data);

export const deleteUser = (id: string): Promise<void> =>
  api.delete(`/users/${id}`).then((r) => r.data);

