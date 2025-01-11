import { verifyEmail } from '@/features/auth/api/verifyEmail';

interface VerifyEmailFormProps {
  params: Promise<{ token: string }>;
}

const VerifyEmailForm = async ({ params }: VerifyEmailFormProps) => {
  const { token } = await params;

  if (!token) {
    throw new Error('No token provided');
  }

  const result = await verifyEmail({ token });

  if (!result.success) {
    return <div>{result.message}</div>;
  }

  return <div>{result.message}</div>;
};

export default VerifyEmailForm;
