import { api } from './api';

export type Role = 'USER' | 'ADMIN';

export type User = {
  id?: string;
  firstName: string; lastName: string; email: string;
  role: Role; enabled: boolean; createdAt?: string;
  password?: string;
};

export const usersApi = api.injectEndpoints({
  endpoints: (build) => ({
    // auth
    login: build.mutation<{ accessToken: string }, { email: string; password: string }>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),

    // users
    listUsers: build.query<User[], void>({
      query: () => '/users',
      providesTags: ['Users'],
    }),
    getUser: build.query<User, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'User', id }],
    }),
    createUser: build.mutation<User, User>({
      query: (body) => ({ url: '/users', method: 'POST', body }),
      invalidatesTags: ['Users'],
    }),
    updateUser: build.mutation<void, { id: string; data: Partial<User> }>({
      query: ({ id, data }) => ({ url: `/users/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (_r, _e, { id }) => ['Users', { type: 'User', id }],
    }),
    deleteUser: build.mutation<void, string>({
      query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useLoginMutation,
  useListUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
