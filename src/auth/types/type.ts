export type SignUpData = {
  message: string;
  user: {
    email: string;
    id: number;
  };
};

export type LoginData = {
  message: string;
  user: {
    id: number;
    email: string;
  };
  tokens: {
    refreshToken: string;
    accessToken: string;
  };
};
