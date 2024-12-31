import { authRoutes } from "@/config";
import AuthFormWrapper from "@/features/auth/components/AuthFormWrapper";
import ForgotPasswordForm from "@/features/auth/components/ForgotPasswordForm";

export default function ForgotPassword() {
  return (
    <AuthFormWrapper
      title="Forgot Password"
      description="Enter your email address and we'll send you a link to reset your password."
      backButtonHref={authRoutes.signIn}
      backButtonLabel="Back to Sign In"
      noBorderMobile
    >
      <ForgotPasswordForm />
    </AuthFormWrapper>
  );
}
