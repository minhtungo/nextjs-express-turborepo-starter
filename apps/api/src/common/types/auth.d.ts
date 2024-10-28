export type AuthJwtPayload = {
  sub: string;
};

export type AuthJwtUser = {
  id: string;
  email: string;
  isTwoFactorEnabled: boolean;
};
