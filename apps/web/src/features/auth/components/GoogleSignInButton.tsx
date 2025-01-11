import Google from '@/components/icons/Google';
import { paths } from '@/config/paths';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@repo/ui/button';

const GoogleSignInButton = () => {
  return (
    <a
      href={`/auth/google?redirect=${paths.app.root.getHref()}`}
      className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
    >
      <Google className="size-4 sm:size-5" /> <span>Sign in with Google</span>
    </a>
  );
};

export default GoogleSignInButton;
