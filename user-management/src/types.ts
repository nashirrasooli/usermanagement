export type Role = 'ADMIN' | 'USER';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  enabled: boolean;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  
}

export interface UserRequest {
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  enabled: boolean;
}
