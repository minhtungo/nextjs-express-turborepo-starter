import { ApiResponseType } from '@/lib/auth';

export interface SignUpDTO extends ApiResponseType {
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
    };
  };
}

export interface SignInDTO extends ApiResponseType {
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
    };
    isTwoFactorEnabled: boolean;
  };
}

export interface ForgotPasswordDTO extends ApiResponseType {
  data: {
    message: string;
  };
}

export interface VerifyEmailDTO extends ApiResponseType {
  data: {
    message: string;
  };
}

export interface ResetPasswordDTO extends ApiResponseType {
  data: {
    message: string;
  };
}

export interface RefreshTokenDTO extends ApiResponseType {
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface SendVerificationEmailDTO extends ApiResponseType {
  data: {
    message: string;
  };
}
