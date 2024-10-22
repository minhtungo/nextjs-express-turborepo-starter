import Facebook from '@/components/icons/Facebook';
import Google from '@/components/icons/Google';
import { Button } from '@/components/ui/button';
import { afterLoginUrl } from '@/config';
import { signInWithProvider } from '@/features/auth/server/actions';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

interface OAuthButtonsProps {
  className?: string;
}

const OAuthButtons = ({}: OAuthButtonsProps) => {
  const searchParams = useSearchParams();
  const redirectURL = searchParams.get('redirect');

  return (
    <>
      <div className='grid gap-3 sm:grid-cols-2'>
        <GoogleLogin label={'google'} redirectURL={redirectURL} />
        <FacebookLogin label={'facebook'} redirectURL={redirectURL} />
      </div>
    </>
  );
};

interface AuthButtonProps {
  className?: string;
  label: string;
  redirectURL: string | null;
}

const FacebookLogin = ({ className, label, redirectURL }: AuthButtonProps) => {
  return (
    <Button
      type='button'
      variant='outline'
      className={cn('w-full', className)}
      onClick={async () =>
        await signInWithProvider('facebook', {
          redirectTo: redirectURL ?? afterLoginUrl,
        })
      }
    >
      <Facebook className='size-4 sm:size-5' /> <span>{label}</span>
    </Button>
  );
};

const GoogleLogin = ({ className, label, redirectURL }: AuthButtonProps) => {
  return (
    <Button
      type='button'
      variant='outline'
      className={cn('w-full', className)}
      onClick={async () =>
        await signInWithProvider('google', {
          redirectTo: redirectURL ?? afterLoginUrl,
        })
      }
    >
      <Google className='size-4 sm:size-5' /> <span>{label}</span>
    </Button>
  );
};

export default OAuthButtons;
