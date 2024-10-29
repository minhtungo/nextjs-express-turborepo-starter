import { verifyEmailService } from '@/features/auth/lib/services';

interface VerifyEmailFormProps {
  searchParams: Promise<{ token: string }>;
}

const VerifyEmailForm = async ({ searchParams }: VerifyEmailFormProps) => {
  const { token } = await searchParams;

  if (!token) {
    throw new Error('No token provided');
  }

  const result = await verifyEmailService(token);

  if (!result.success) {
    return <div>{result.message}</div>;
  }

  return <div>{result.message}</div>;
};

export default VerifyEmailForm;
