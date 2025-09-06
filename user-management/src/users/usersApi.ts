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

export type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

type ListUsersArgs = {
  firstName?: string;
  lastName?: string;
  q?: string;
  page?: number; // 0-based
  size?: number;
  sortField?: string; // e.g., 'createdAt'
  sortOrder?: 'asc' | 'desc';
} | void;

export const usersApi = api.injectEndpoints({
  endpoints: (build) => ({
    // auth
    login: build.mutation<{ accessToken: string }, { email: string; password: string }>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),

    // users (paged)
    listUsers: build.query<PageResponse<User>, ListUsersArgs>({
      query: (args) => {
        const params = new URLSearchParams();
        if (args && args.firstName?.trim()) params.set('firstName', args.firstName.trim());
        if (args && args.lastName?.trim()) params.set('lastName', args.lastName.trim());
        if (args && args.q?.trim()) params.set('q', args.q.trim());

        // pagination
        const page = args?.page ?? 0;
        const size = args?.size ?? 10;
        params.set('page', String(page));
        params.set('size', String(size));

        // sorting (Spring expects sort=field,dir)
        const sortField = args?.sortField ?? 'createdAt';
        const sortOrder = args?.sortOrder ?? 'desc';
        params.append('sort', `${sortField},${sortOrder}`);

        return `/users?${params.toString()}`;
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
