import axios from 'axios';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { UserRequest } from './users/types';

// --- Axios instance for manual calls ---
export const axiosApi = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
});

// Attach token to every request
axiosApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // consistent with authSlice
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally
axiosApi.interceptors.response.use(
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

// --- RTK Query base API (for injectEndpoints) ---
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Users', 'User'],
  endpoints: () => ({}),
});

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

// --- Axios-based API functions (manual) ---
export const getUser = (id: string): Promise<User> =>
  axiosApi.get(`/users/${id}`).then((r) => r.data as User);

export const listUsers = (): Promise<User[]> =>
  axiosApi.get('/users').then((r) => r.data);

export const createUser = (payload: UserRequest): Promise<User> =>
  axiosApi.post('/users', payload).then((r) => r.data);

export const updateUser = (id: string, payload: UserRequest): Promise<User> =>
  axiosApi.put(`/users/${id}`, payload).then((r) => r.data);

export const deleteUser = (id: string): Promise<void> =>
  axiosApi.delete(`/users/${id}`).then((r) => r.data);
