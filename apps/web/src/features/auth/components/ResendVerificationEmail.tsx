'use client';

import LoaderButton from '@/components/LoaderButton';
import { useSendVerificationEmail } from '@/features/auth/api/sendVerificationEmail';
import FormResponse from '@/features/auth/components/FormResponse';

import { cn } from '@/lib/utils';

interface ResendVerificationEmailProps extends React.ComponentProps<'button'> {
  token: string;
}

const ResendVerificationEmail = ({ className, token }: ResendVerificationEmailProps) => {
  const { mutate: sendVerificationEmail, isPending, error, isSuccess } = useSendVerificationEmail({});

  const onResendVerificationEmail = async () => {
    sendVerificationEmail({ token });
  };

  return (
    <>
      {error && <FormResponse variant="destructive" className="mt-4" description={error.message} title="Error" />}
      {isSuccess && <FormResponse variant="success" title="Success" description="Verification email sent" />}
      <LoaderButton
        type="button"
        className={cn('w-full', className)}
        onClick={onResendVerificationEmail}
        isPending={isPending}
      >
        Resend Verification Email
      </LoaderButton>
    </>
  );
};

export default ResendVerificationEmail;
