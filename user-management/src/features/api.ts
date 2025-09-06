import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../app/store';

const baseUrl = (import.meta as any)?.env?.VITE_API_BASE_URL
  ?? process.env.REACT_APP_API_BASE_URL
  ?? 'http://localhost:8080/api';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('authorization', `Bearer ${token}`);
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Users', 'User'],
  endpoints: () => ({}),
});
