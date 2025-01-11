import { paths } from '@/config/paths';
import AuthFormWrapper from '@/features/auth/components/AuthFormWrapper';
import ForgotPasswordForm from '@/features/auth/components/ForgotPasswordForm';

export default function ForgotPassword() {
  return (
    <AuthFormWrapper
      title="Forgot Password"
      description="Enter your email address and we'll send you a link to reset your password."
      backButtonHref={paths.auth.signIn.getHref()}
      backButtonLabel="Back to Sign In"
      noBorderMobile
    >
      <ForgotPasswordForm />
    </AuthFormWrapper>
  );
}
