import ResetPasswordForm from '@/features/auth/components/ResetPasswordForm';

export default async function ResetPassword({ searchParams }: { searchParams: Promise<{ token: string }> }) {
  const { token } = await searchParams;

  if (!token) {
    throw new Error('No token provided');
  }

  return <ResetPasswordForm token={token} />;
}
