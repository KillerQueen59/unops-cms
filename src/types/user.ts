export interface User extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
  createdAt: string;
  createdBy: string;
  lastModified: string;
  modifiedBy: string;
  password?: string;
}

export enum UserRole {
  SUPER_ADMIN = 'Super Admin',
  ADMIN = 'Admin',
  USER = 'User',
}

export enum UserStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

export interface UserHistoryLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  performedBy: string;
  performedAt: string;
}

export type UserTable = User;
