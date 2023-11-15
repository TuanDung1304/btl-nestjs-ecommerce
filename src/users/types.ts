import { Role } from '@prisma/client';

export interface ListUsersData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  avatar: string;
  birthday: Date;
  role: Role;
  createdAt: Date;
}
