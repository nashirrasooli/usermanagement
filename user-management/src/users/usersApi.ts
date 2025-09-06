import { api } from "../api";

export type Role = 'USER' | 'ADMIN';

export type User = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
  password?: string;
};

type ListUsersArgs = {
  q?: string;
  firstName?: string;
  lastName?: string;
};

export const usersApi = api.injectEndpoints({
  endpoints: (build) => ({
    // auth
    login: build.mutation<{ accessToken: string }, { email: string; password: string }>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),

    // users
    listUsers: build.query<User[], ListUsersArgs | void>({
      query: (args) => {
        if (!args) return '/users';
        const params = new URLSearchParams();
        if (args.q) params.set('q', args.q);
        if (args.firstName) params.set('firstName', args.firstName);
        if (args.lastName) params.set('lastName', args.lastName);
        const qs = params.toString();
        return qs ? `/users?${qs}` : '/users';
      },
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
