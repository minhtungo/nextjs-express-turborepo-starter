export interface SignUpDTO {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
  };
}

export interface SignInDTO {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
  };
}

export interface ForgotPasswordDTO {
  message: string;
}

export interface VerifyEmailDTO {
  message: string;
}

export interface ResetPasswordDTO {
  message: string;
}

export interface RefreshTokenDTO {
  accessToken: string;
  refreshToken: string;
}

export interface SendVerificationEmailDTO {
  message: string;
}
