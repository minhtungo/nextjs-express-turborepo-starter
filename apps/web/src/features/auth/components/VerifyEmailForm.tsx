import { verifyEmailService } from '@/features/auth/lib/services';

interface VerifyEmailFormProps {
  params: Promise<{ token: string }>;
}

const VerifyEmailForm = async ({ params }: VerifyEmailFormProps) => {
  const { token } = await params;

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
