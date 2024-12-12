import Google from '@/components/icons/Google';
import { buttonVariants } from '@repo/ui/button';
import { cn } from '@/lib/utils';
import { afterLoginUrl } from '@/config';

const GoogleSignInButton = () => {
  return (
    <a href={`/auth/google?redirect=${afterLoginUrl}`} className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}>
      <Google className='size-4 sm:size-5' /> <span>Sign in with Google</span>
    </a>
  );
};

export default GoogleSignInButton;
