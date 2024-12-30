import AuthFormWrapper from '@/features/auth/components/AuthFormWrapper';
import SignUpForm from '@/features/auth/components/SignUpForm';

export default function SignUp() {
  return (
    <AuthFormWrapper title="Sign Up" description="Sign up an account" noBorderMobile>
      <SignUpForm />
    </AuthFormWrapper>
  );
}
