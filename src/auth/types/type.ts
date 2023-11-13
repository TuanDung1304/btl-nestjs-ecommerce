import { Users } from '@prisma/client';

export type SignUpData = {
  message: string;
  user: {
    email: string;
    id: number;
  };
};

export type LoginData = {
  message: string;
  user: Pick<
    Users,
    'avatar' | 'firstName' | 'role' | 'email' | 'id' | 'lastName'
  >;
  tokens: {
    refreshToken: string;
    accessToken: string;
  };
};

export type RefreshTokensData = {
  message: string;
  accessToken: string;
};
