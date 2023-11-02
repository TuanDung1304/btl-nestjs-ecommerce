import { User } from '@prisma/client';

export type SignUpData = {
  message: string;
  user: {
    email: string;
    id: number;
  };
};

export type LoginData = {
  message: string;
  user: Pick<User, 'avatar' | 'firstName' | 'role' | 'email' | 'id'>;
  tokens: {
    refreshToken: string;
    accessToken: string;
  };
};
