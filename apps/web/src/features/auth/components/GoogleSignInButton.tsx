import Google from '@/components/icons/Google';
import { afterLoginUrl } from '@/lib/config';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@repo/ui/button';

const GoogleSignInButton = () => {
  return (
    <a href={`/auth/google?redirect=${afterLoginUrl}`} className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}>
      <Google className="size-4 sm:size-5" /> <span>Sign in with Google</span>
    </a>
  );
};

export default GoogleSignInButton;
